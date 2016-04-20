var express    		= require('express');
var async      		= require('async');
var router     		= express.Router();
var bodyParser 		= require('body-parser');
var randomstring 	= require('randomstring');
var connection 		= require('./db');
var nano   			= require('./nano');
var transaction   	= require('./transaction');
var app 			= express();
var schedule 		= require('node-schedule');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var supplier_db 	= nano.db.use('ipay_supplier');
var transaction_db 	= nano.db.use('ipay_transaction');

router.use(function(req, res, next) {//Untuk cek apakah ada session
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
					console.log("session sukses");
					next();
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
});

router.post("/getKategori",function(req, res, next) {
var getKategori = 'SELECT * from kategori_produk where id_kategori="'+req.body.id_kategori+'"';
	connection.query(getKategori, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(fields);
		}
	});
});

router.post("/addKategori",function(req, res, next) {
var id_kategori 		= req.body.id_kategori;
var nama_kategori 		= req.body.nama_kategori;
var id_super_kategori 	= req.body.id_super_kategori;
var addKategori = 'INSERT INTO kategori_produk (id_kategori,nama_kategori,id_super_kategori) values ("'+id_kategori+'","'+nama_kategori+'","'+id_super_kategori+'")';
	connection.query(addKategori, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json({"status" : "Inserted"});
		}
	});
});

router.put("/updateKategori",function(req, res, next) {
var addKategori = 'UPDATE kategori_produk SET nama_kategori="'+req.body.nama_kategori+'",id_super_kategori="'+req.body.id_super_kategori+'" where (id_kategori="'+req.body.id_kategori+'")';
	connection.query(addKategori, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json({"status" : "Updated"});
		}
	});
});

router.delete("/delKategori",function(req,res,next) {
	var delKategori = 'delete from kategori_produk where id_kategori="'+req.body.id_kategori+'"';
	connection.query(delKategori, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Deleted: ' + JSON.stringify(rows));
			res.json({"status" : "deleted"});
		}
	});
				
});

module.exports = router;