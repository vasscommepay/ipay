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

/*router.use(function(req, res, next) {//Untuk cek apakah ada session
    console.log(req.method, req.url);
    var session = req.body.session;
	if(session!=null){
		cek_session(session,function(err,exists,time){
			if(err){
				console.log(err);
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
});*/

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
	var all = req.body.is_all;
	var sql = "SELECT * FROM kategori_produk WHERE kategori_produk.id_super_kategori IS null";
	if(all){
		sql = "SELECT *,(SELECT count(*) FROM master_produk WHERE kategori_produk = id_kategori) as jml_produk FROM kategori_produk";
	}
	connection.query(sql,function(err,rows){
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

	connection.query(sqlProduk,function(err,rows){
		if(err){
			console.log(err);  
   			res.json({"available" : false,"message":err});
		}else{
			console.log(sqlProduk);
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
    	sqlProduk = "SELECT *,master_produk.nominal FROM produk_member LEFT JOIN master_produk ON product_id = id  WHERE member_id=?";
    }

	connection.query(sqlProduk,[uplink],function(err,rows){
		console.log(sqlProduk);
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
	if(req.body.super_kategori!=''){
		var superkat = connection.escape(req.body.super_kategori);
		sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori,id_super_kategori) VALUES('+id+','+nama+','+superkat+')';
	}
	console.log(sql);
	async.series([
		// function(callback){
		// 	connection.query(sql,function(err,result){
		// 		if(err){
		// 			callback(err);
		// 		}else{
		// 			callback();
		// 		}
		// 	});
		// }
		// ,
		function(callback){
			//addFrom kategori
			if(!isEmpty(req.body.form)&&req.body.super_kategori!=''){
				var forms = req.body.form;
				console.log('%j',forms);
				sql = 'INSERT INTO kategori_form(id_kategori,input_name,input_type,input_label) VALUES ';
				for(var key in forms){
					var name = connection.escape(forms[key].nama);
					var tipe = connection.escape(forms[key].tipe);
					var label = connection.escape(forms[key].label);
					var this_sql = '('+id+','+name+','+tipe+','+label+'),';
					sql = sql+this_sql;
				}
				sql = sql.substring(0,(sql.length)-1);
				console.log(sql);
				connection.query(sql,function(err,rows){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			}else{
				callback();
			}
		}
	]
	,function(err){
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
		}else{
			res.json({"error":false,"message":'Kategori Berhasil Ditambahkan'});
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
	var supplier = req.body.supplier;
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
			var sql = "INSERT INTO supplier_produk(id_supplier,id_produk,harga_terkini) VALUES";
			var count = 0;
			for(var id_sup in supplier){
				count++;
				//var idsup = connection.escape(id_sup);
				var harga = supplier[id_sup];
				sql = sql+'('+id_sup+','+id+','+harga+'),';
			}
			var len = sql.length;
			sql = sql.substring(0,len-1);
			console.log(sql);
			connection.query(sql,function(err,result){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
		,
		function(callback){
			//Update harga beli tiap wilayah;
			if(!isEmpty(req.body.harga_wilayah)){
				var wilayah = req.body.harga_wilayah;
				updateHargaWilayah(wilayah,id,function(err,result){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			}else{
				callback();
			}
		}
		,
		function(callback){
			//update harga beli tiap downlink
			if(!isEmpty(req.body.harga_downlink)){
				var downlink = req.body.harga_downlink;
				updateHargaDownlink(downlink,id,function(err,result){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			}else{
				callback();
			}
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
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
}
function updateHargaDownlink(downlinks,id_produk,callback){
	var sql='';
	for(var id in downlinks){
		var harga = downlinks[id];
		var member_id = connection.escape(id);
		if(harga!=''){
			var this_sql = 'UPDATE produk_member SET harga_jual = '+harga+' WHERE product_id = '+id_produk+' AND member_id='+member_id+';';
			sql = sql+this_sql;
		}
	}
	sql = sql.substring(0,(sql.length)-1);
	console.log(sql);
	connection.query(sql,function(err,result){
		if(err){
			callback(err);
		}else{
			callback(null,true);
		}
	});
}
function updateHargaWilayah(wilayah,id_produk,callback){
	var sql=''; 
	for(var id in wilayah){
		var harga = wilayah[id];
		var id_wilayah = connection.escape(id);
		if(harga!=null){
			var this_sql = 'UPDATE produk_member SET harga_jual='+harga+' WHERE product_id = '+id_produk+' AND member_id IN (SELECT id_member FROM member_korwil WHERE id_wilayah='+id_wilayah+');'
			sql = sql+this_sql;
		}		
	}
	sql = sql.substring(0,(sql.length)-1);
	console.log(sql);
	connection.query(sql,function(err,result){
		if(err){
			callback(err);
		}else{
			callback(null,true);
		}
	});
}

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

router.post('/getSupplier',function(req,res){
	var sql_query = "SELECT DISTINCT supplier.id_supplier as id_sup, supplier.*,address.jalan,kecamatan.Nama as kec,kabupaten.Nama as kab,provinsi.Nama as prov,(SELECT value FROM supplier_contact WHERE id_channel = 'em' AND id_supplier = id_sup ) as email,(SELECT value FROM supplier_contact WHERE id_channel = 'hp' AND id_supplier = id_sup ) as hp FROM supplier LEFT JOIN address ON alamat_supplier = id_address LEFT JOIN kecamatan ON IDKecamatan = id_kecamatan LEFT JOIN kabupaten ON kabupaten.IDKabupaten = id_kota LEFT JOIN provinsi ON provinsi.IDProvinsi = id_provinsi LEFT JOIN supplier_contact ON supplier.id_supplier = supplier_contact.id_supplier";
	getData(sql_query,function(err,rows){
		if(err){
			console.log(res.url,err);
			res.json({'error':true,'message':err});
		}else{
			res.json(rows);
		}
	});
});

router.post('/addSupplier',function (req,res) {
	var id_sup = req.body.id_supplier;
	var nama_sup = req.body.nama_supplier;
	var dep = req.body.deposit_sup;
	var pic = req.body.pic_supplier;
	var alamat = req.body.address;
	var kontak = req.body.kontak;
	var gw_address = req.body.gw_address;
	var gw_format = req.body.gw_format;
	var gw_method = req.body.gw_method;
	var id_alamat;
	async.series([
		function(callback){
			var nama_alamat = alamat.addressName;
			var jalan = alamat.jalan;
			var prov = alamat.prov;
			var kota = alamat.kot;
			var kec = alamat.kec;
			var sql = "INSERT INTO address(name,jalan,id_kecamatan,id_kota,id_provinsi) VALUES(?,?,?,?,?)";
			//console.log('sql address: '+sql);
			connection.query(sql,[nama_alamat,jalan,kec,kota,prov],function(err,result) {
				if(err){
					callback('sql alamat, '+err);
				}else{
					id_alamat = result.insertId;
					callback();
				}
			});
		}
		,function(callback){
			var sql = "INSERT INTO supplier(id_supplier,nama_supplier,total_deposit,pic,alamat_supplier) VALUES(?,?,?,?,?)";
			connection.query(sql,[id_sup,nama_sup,dep,pic,id_alamat],function(err,result){
				if(err){
					callback('sql data, '+err);
				}else{
					callback();
				}
			});
		}
		,function(callback) {
			var sql = "INSERT INTO supplier_contact(id_supplier,id_channel,value) VALUES";
			for(var ch in kontak){
				var value = kontak[ch];
				sql = sql+"('"+id_sup+"','"+ch+"','"+value+"'),";
			} 
			sql = sql.substring(0, sql.length-1);
			//console.log('sql kontak: '+sql);
			connection.query(sql,function(err,result){
				if(err){
					callback('sql kontak, '+err);
				}else{
					callback();
				}
			});
		}
		,function(callback){
			var sql = "INSERT INTO supplier_gateway(address,metode,format_kirim,id_supplier) VALUES";
			for(var i = 0;i<gw_address.length;i++){
				var id = connection.escape(id_sup);
				var each_gw_address = connection.escape(gw_address[i]);
				var each_gw_format = connection.escape(gw_format[i]);
				var each_gw_method = connection.escape(gw_method[i]);
				sql = sql+"("+each_gw_address+","+each_gw_method+","+each_gw_format+","+id+"),";
			}
			sql = sql.substring(0, sql.length-1);
			//console.log('sql gateway: '+sql);
			connection.query(sql,function(err,result){
				if(err){
					callback('sql gateway, '+err);
				}else{
					callback();
				}
			});
		}
		,function(callback){
			couchdb.exportNewSupplier(id_sup,function(err,result){
				if(err){
					callback('couch, '+err);
				}else{
					callback();
				}
			});
		}
	]
	,function (err){
		if(err){
			console.log(req.url,err);
			res.json({'error':true,'message':err});
		}else{
			res.json({'error':false,'message':'add supplier success'});
		}
	});
})
function getData(sql,callback){
	connection.query(sql,function(err,rows){
		if(err){
			callback(err);
		}else{
			if(rows.length==0){
				err = sql+"empty table";
				callback(err);
			}else{
				callback(null,rows);
			}
		}
	});
}

module.exports = router;