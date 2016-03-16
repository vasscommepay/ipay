var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'ipaydb'
});

router.get("/provinsi",function(req,res,next){
	var sql = "SELECT * FROM provinsi";
	connection.query(sql, function(err,rows){
		if(err){
			console.log(err);
			res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	});
});
router.post("/getKota",function(req,res,next){
	var id_provinsi = connection.escape(req.body.id_prov);
	var sql = "SELECT * FROM kabupaten WHERE IDProvinsi="+id_provinsi;
	connection.query(sql, function(err,rows){
		if(err){
			console.log(err);
			res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	})
});
router.post("/getKecamatan",function(req,res,next){
	var id_kabupaten = connection.escape(req.body.id_kab);
	var sql = "SELECT * FROM kecamatan WHERE IDKabupaten ="+id_kabupaten;
	connection.query(sql, function(err,rows){
		if(err){
			console.log(err);
			res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	})
});
module.exports = router;