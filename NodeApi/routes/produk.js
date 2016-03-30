var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var sessionStat = false;

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
				res.json({"status":"error","message":err});
			}else{
				if(rows[0].result===0){
					res.json({"status":"error","message":"Session tidak terdaftar"});
				}else{
					next();
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
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
			console.log(rows);
			res.json(rows);
		}
	});
});	

router.post('/getSubKategori',function(req,res){
	var uplink = req.body.uplink;
	var super_kategori = req.body.super_kategori;
	
	var sql = "SELECT DISTINCT master_produk.kategori_produk FROM master_produk LEFT JOIN produk_member ON master_produk.id = produk_member.product_id LEFT JOIN kategori_produk ON master_produk.kategori_produk = kategori_produk.id_kategori WHERE produk_member.member_id = ? AND id_super_kategori = ? ";
	connection.query(sql,[uplink,super_kategori],function(err,rows){
		if(err){
			console.log(err);
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
    	sqlProduk = "SELECT * FROM produk_member JOIN master_produk ON product_id = id WHERE member_id= ? AND kategori_produk='"+req.body.kategori+"'";
    }else{
    	sqlProduk = "SELECT * FROM produk_member WHERE member_id=?";
    }

	connection.query(sqlProduk,[uplink],function(err,rows){
		if(err){
			console.log(err);  
   			res.json({"available" : false,"message":err});
		}else{
			if(rows==null){
				res.json({"available":false,"message":"produk kosong"});
			}else{
				res.send(rows[0]);
			}		
		}
	});
});

router.post("/addKategori",function(req,res){
	var id = connection.escape(req.body.idKat);
	var nama = connection.escape(req.body.namaKat);
	var sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori) VALUES('+id+','+nama +')';
	if(req.body.superKat!=null){
		var superkat = connection.escape(req.body.superKat);
		sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori,id_super_kategori) VALUES('+id+','+nama+','+superkat+')';
	}
	connection.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.json({"inserted":false,"message":err});
		}else{
			res.json({"inserted":true,"affectedRidows":result.affectedRows});
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
			console.log("update status kosong produk: "+id+" sukses");
			res.json({"updated":true,"affectedRows":result.affectedRows});
		}
	});
});

router.post("/updateHargaBeli",function(req,res){
	var id = connection.escape(req.body.idproduk);
	var harga = connection.escape(req.body.harga_beli);
	var sql = "UPDATE master_produk SET harga_beli = "+harga_beli+" WHERE id= "+id;
	connection(sql,function(err,result){
		if(err){
			console.log(err);
			res.json({"updated":false,"message":err});
		}else{
			console.log("update harga_beli produk: "+id+" sukses");
			res.json({"updated":true,"affectedRows":result.affectedRows});
		}
	});
});

router.post("/updateProduk",function(req,res,next) {
	var id = connection.escape(req.body.idproduk);
	var nama = connection.escape(req.body.namaproduk);
	var harga_beli = connection.escape(req.body.harga_beli);
	var keterangan = connection.escape(req.body.keterangan);
	var kategori_produk = connection.escape(req.body.kategori_produk);
	var nominal = connection.escape(req.body.nominal);
	var prabayar = connection.escape(req.body.prabayar);
	var aktif = connection.escape(req.body.aktif);
	var kosong = connection.escape(req.body.kosong);
	var sql = 'UPDATE master_produk SET nama = '+nama+',harga_beli = '+harga_beli+',keterangan = '+keterangan+',kategori_produk = '+kategori_produk+',nominal = '+nominal+',prabayar = '+prabayar+' WHERE id = '+id;

	var session = req.body.session;
	connection.query(sql, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"updated":false,"message":err});
		}else{
			res.json({"updated":true});
		}
	});

});
router.post("/addProduk",function(req,res,next) {
	var id = connection.escape(req.body.idproduk);
	var nama = connection.escape(req.body.namaproduk);
	var harga_beli = connection.escape(req.body.harga_beli);
	var keterangan = connection.escape(req.body.keterangan);
	var kategori_produk = connection.escape(req.body.kategori_produk);
	var nominal = connection.escape(req.body.nominal);
	var prabayar = connection.escape(req.body.prabayar);
	var aktif = connection.escape(req.body.aktif);
	var kosong = connection.escape(req.body.kosong);
	var sql = 'INSERT INTO master_produk(id,nama,harga_beli,keterangan,kategori_produk,nominal,prabayar,aktif,kosong) VALUES('+id+','+nama+','+harga_beli+','+keterangan+','+kategori_produk+','+nominal+','+prabayar+','+aktif+','+kosong+')';

	connection.query(sql, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.send(sql);
		}else{
			res.json({"inserted":true});
		}
	});

});

module.exports = router;