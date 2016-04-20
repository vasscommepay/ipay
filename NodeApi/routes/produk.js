 var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');
var nano   = require('./nano');
var app = express();
var couchdb = require('./couchdbfunction');
var cek_session = require('./session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var sessionStat = false;

router.use(function(req, res, next) {//Untuk cek apakah ada session
    console.log(req.method, req.url);
    var session = req.body.session;
	if(session!=null){
		cek_session(session,function(err,exists,time){
			if(err){
				res.json({"error":true,"message":err});
			}else{
				if(exists){
					next();
				}else{
					res.json({"error":true,"message":time})
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
});

router.post('/getForm',function(req,res){
	var id_kategori = req.body.id_kategori;
	var form = nano.db.use('ipay_form');
	form.get(id_kategori,function(err,rows){
		if(err){
			console.log("get form error: "+err);
			res.json({"error":true,"msessage":err});
		}else{
			var properties = rows['prop'];
			res.json(properties);
		}
		
	});
});

router.post('/getKategori',function(req,res){
	var uplink = req.body.uplink;
	console.log(uplink);
	var sql = "SELECT * FROM kategori_produk WHERE kategori_produk.id_super_kategori IS null";
	connection.query(sql,[uplink],function(err,rows){
		if(err){
			console.log(err);
			res.json({"available":false,"message":err});
		}else{
			res.json(rows);
		}
	});
});	

router.post('/getSubKategori',function(req,res){
	var uplink = req.body.uplink;
	var super_kategori = req.body.id_kategori;
	var sql = "SELECT * FROM kategori_produk WHERE kategori_produk.id_super_kategori =?";
	connection.query(sql,[super_kategori],function(err,rows){
		if(err){
			res.json({"available":false,"message":err});
		}else{
			if(rows==null){
				res.json({"available":false,"message":"produk kosong"});
			}else{
				res.json(rows);
			}
		}
	});
});	

router.post('/getProduk',function(req,res){
	var uplink = req.body.uplink;

	if(req.body.kategori!=null){
		console.log("kategori: "+req.body.kategori);
    	sqlProduk = "SELECT * FROM master_produk WHERE kategori_produk='"+req.body.kategori+"'";
    }else{
    	console.log("kategori: "+req.body.kategori);
    	sqlProduk = "SELECT * FROM master_produk LEFT JOIN kategori_produk ON master_produk.kategori_produk = id_kategori";
    }

	connection.query(sqlProduk,[uplink],function(err,rows){
		if(err){
			console.log(err);  
   			res.json({"available" : false,"message":err});
		}else{
			if(rows==null){
				res.json({"available":false,"message":"produk kosong"});
			}else{
				res.send(rows);
			}		
		}
	});
});

router.post('/getProdukMember',function(req,res){
	var uplink = req.body.uplink;

	if(req.body.kategori!=null){
		console.log("kategori: "+req.body.kategori);
    	sqlProduk = "SELECT *, master_produk.nominal FROM produk_member LEFT JOIN master_produk ON product_id = id WHERE member_id= ? AND kategori_produk='"+req.body.kategori+"'";
    }else{
    	console.log("kategori: "+req.body.kategori);
    	sqlProduk = "SELECT * FROM produk_member LEFT JOIN master_produk ON product_id = id  WHERE member_id=?";
    }

	connection.query(sqlProduk,[uplink],function(err,rows){
		if(err){
			console.log(err);  
   			res.json({"available" : false,"message":err});
		}else{
			if(rows==null){
				res.json({"available":false,"message":"produk kosong"});
			}else{
				res.send(rows);
			}		
		}
	});
});

router.post("/addKategori",function(req,res){
	var id = connection.escape(req.body.id_kategori);
	var nama = connection.escape(req.body.nama_kategori);
	var sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori) VALUES('+id+','+nama +')';
	if(req.body.super_kategori!=null){
		var superkat = connection.escape(req.body.super_kategori);
		sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori,id_super_kategori) VALUES('+id+','+nama+','+superkat+')';
	}
	console.log(sql);
	connection.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
		}else{
			res.json({"error":false,"affectedRidows":result.affectedRows});
		}
	});
});

router.post("/updateAktifBanyakProduk",function(req,res){
	var products = req.body.products;
	var aktif = req.body.aktif;
	var sql = "UPDATE master_produk SET aktif ="+aktif+" WHERE id_produk = "+products[1];
	async.each(products, function(product,callback){
		sql =sql+" OR id_produk = "+product;
		callback();
	},function(err){
		connection.query(sql,function(err,result){
			if(err){
				console.log(err);
				res.json({"updated":false,"message":err});
			}else{
				res.json({"updated":true,"affectedRows":result.affectedRows});
			}
		});
		res.send(sql);
	});
});

router.post("/updateKosongBanyakProduk",function(req,res){
	var products = req.body.products;
	var kosong = req.body.kosong;
	var sql = "UPDATE master_produk SET kosong ="+kosong+" WHERE id_produk = "+products[1];
	async.each(products, function(product,callback){
		sql =sql+" OR id_produk = "+product;
		callback();
	},function(err){
		connection.query(sql,function(err,result){
			if(err){
				console.log(err);
				res.json({"updated":false,"message":err});
			}else{
				res.json({"updated":true,"affectedRows":result.affectedRows});
			}
		});
		res.send(sql);
	});
});

router.post("/updateAktifSatuProduk",function(res,req){
	var aktif = connection.escape(req.body.aktif);
	var id_produk = connection.escape(req.body.id_produk);
	var sql = "UPDATE master_produk SET aktif ="+aktif+" WHERE id ="+id_produk;
	connection.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.json({"updated":false,"message":err});
			console.log("update status aktif produk: "+id+" gagal");
		}else{
			console.log("update status aktif produk: "+id+" sukses");
			res.json({"updated":true,"affectedRows":result.affectedRows});
		}
	});
});

router.post("/updateKosongSatuProduk",function(res,req){
	var kosong = connection.escape(req.body.kosong);
	var id_produk = connection.escape(req.body.id_produk);
	var sql = "UPDATE master_produk SET kosong ="+kosong+" WHERE id ="+id_produk;
	connection.query(sql,function(err,result){
		if(err){
			console.log(err);
			console.log("update status_kosong produk: "+id+" gagal");
			res.json({"updated":false,"message":err});
		}else{
			couchdb.updateSingleProduk(id_produk,function(err, body){
				if(err){
					console.log(err);
					res.json({"updated":false,"message":err});
				}else{
					console.log(body);
					console.log("update status kosong produk: "+id+" sukses");
					res.json({"updated":true,"affectedRows":result.affectedRows});
				}
			});
			
		}
	});
});

router.post("/updateHargaBeli",function(req,res){
	var id = connection.escape(req.body.idproduk);
	var harga = connection.escape(req.body.harga_beli);
	var sql = "UPDATE master_produk SET harga_beli = "+harga_beli+" WHERE id= "+id;

	async.series([
		function(callback){
			connection.query(sql,function(err,result){
				if(err){
					callback(err);
				}else{
					console.log(result);
					callback()
				}
			});
		},
		function(callback){
			var sql = 'UPDATE produk_member SET harga_beli ='+harga_beli+' WHERE product_id='+id+' AND harga_beli <'+harga_beli;
			connection.query(sql,function(err,result){
				if(err){
					callback(err);
				}else{
					console.log(result);
					callback();
				}
			});
		},
		function(callback){
			couchdb.updateSingleProduk(id,function(err,body){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	],function(err){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else{
			res.json({'error':false,'message':'produk: '+id+' berhasil diubah'});
		}
	});
});

router.post("/updateProduk",function(req,res) {
	console.log('update produk');
	var id = connection.escape(req.body.id_produk);
	var nama = connection.escape(req.body.nama_produk);
	var keterangan = connection.escape(req.body.keterangan);
	var harga_produk = connection.escape(req.body.harga_produk);
	var kategori_produk = connection.escape(req.body.kategori_produk);
	var nominal = connection.escape(req.body.nominal_produk);
	var tipe = connection.escape(req.body.tipe_produk);
	var aktif = connection.escape(req.body.status_aktif);
	var kosong = connection.escape(req.body.status_kosong);
	var sql = 'UPDATE master_produk SET nama = '+nama+',keterangan = '+keterangan+',kategori_produk = '+kategori_produk+',harga_beli='+harga_produk+',nominal = '+nominal+',tipe = '+tipe+' WHERE id = '+id;
	var session = req.body.session;
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"error":true,"message":err});
		}else{
			couchdb.updateSingleProduk(req.body.id_produk,function(err,body){
				if(err){
					console.log(err);
				}else{
					res.json({"error":false});
				}
			});
		}
	});

});
router.post("/addProduk",function(req,res,next) {
	var id = connection.escape(req.body.idproduk);
	var nama = connection.escape(req.body.namaproduk);
	var harga_beli = connection.escape(req.body.harga_beli);
	var kategori_produk = connection.escape(req.body.kategori_produk);
	var nominal = connection.escape(req.body.nominal);
	var tipe = connection.escape(req.body.tipe);
	var sql = 'INSERT INTO master_produk(id,nama,harga_beli,kategori_produk,nominal,tipe,aktif,kosong) VALUES('+id+','+nama+','+harga_beli+','+kategori_produk+','+nominal+','+tipe+',1,0)';
	console.log(sql);
	async.series([
		function(callback){
			console.log('insert to master');
			connection.query(sql, function(err, rows, fields) {
				if (err){
				   callback(err);
				}else{
					callback();
				}
			});
		}
		,function(callback){
			console.log('insert to member');
			var sql = 'INSERT INTO produk_member(product_id,member_id,harga_beli) SELECT '+id+',id_member,'+harga_beli+' FROM member';
			connection.query(sql,function(err,res){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
		,function(callback){
			console.log('export to couchdb');
			couchdb.exportSingleProduk(req.body.idproduk,function(err,body){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	],
	function(err){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else{
			console.log(sql);
			res.json({'error':false,'message':'produk: '+id+' berhasil ditambahkan'});
		}
	});
});
router.post('/delProduk',function(req,res){
	var id = req.body.idproduk;
	async.series([
		function(callback){
			var idproduk = connection.escape(id);
			var query = 'DELETE FROM master_produk WHERE id='+idproduk;
			connection.query(query,function(err,result){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}	
		,function(callback){
			couchdb.deleteDoc('ipay_produk',id,function(err,result){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	]
	,function(err){
		if(err){
			console.log(err);
			req.json({'error':true,'message':err});
		}else{
			req.json({'error':false,'message':err});
		}
	});
});
module.exports = router;