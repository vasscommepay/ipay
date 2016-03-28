var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');

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
	var sql = "SELECT DISTINCT master_produk.kategori_produk FROM master_produk JOIN produk_member ON master_produk.id = produk_member.product_id WHERE produk_member.member_id = ? ";
	connection.query(sql,[uplink],function(err,rows){
		if(err){
			console.log(err);
		}else{
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

router.post('/getProduct',function(req,res){
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
				res.json(rows);
			}		
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
	var sql = 'INSERT INTO master_produk(id,nama,harga_beli,keterangan,kategori_produk,nominal,prabayar) VALUES("'+id+'","'+nama+'",'+harga_beli+',"'+keterangan+'","'+kategori_produk+'","'+nominal+'","'+prabayar+'")';

	var session = req.body.session;
	connection.query(sql, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.send(err);
		}else{
			res.json({"status":"inserted"});
		}
	});

});

module.exports = router;