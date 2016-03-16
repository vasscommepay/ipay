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

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function (req, res, next) {
 	var id_member 		= connection.escape(req.body.id_member);
	var	identity_number = connection.escape(req.body.identity_number);
	var	npwp			= connection.escape(req.body.npwp);
	var	level_member	= connection.escape(req.body.level_member);
	var	updated_at		= connection.escape(req.body.updated_at);
	var	total_komisi	= connection.escape(req.body.total_komisi);
	var	total_saldo		= connection.escape(req.body.total_saldo);
});

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
				res.json({"status":"error","message":err});
			}else{
				next(); 
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
    // continue doing what we were doing and go to the route
});


router.post("/tampil-get",function(req, res, next) {
var tampilGet = { sql : 'SELECT * from member' }

	connection.query(tampilGet, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	});
});

router.post("/contactChannel", function(req,res,next){
	var sql = "SELECT * FROM contact_channel";
	connection.query(sql,function(err,rows){
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	})
});
router.post("/tampil-post",function(req, res, next) {
	var tampilPost = { sql : 'SELECT * from member where id_member="'+req.body.id_member+'"' }
	connection.query(tampilPost, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Inserted: ' + JSON.stringify(rows));
			res.json(rows);
		}
	});
});


router.post("/simpan",function(req, res, next) {
	var simpan = { sql : 'insert into member (identity_number,nama,tanggal_lahir,jenis_kelamin, npwp, level_member) values ("'+req.body.identity_number+'" , "'+req.body.nama+'" , "'+req.body.tanggal_lahir+'" , "'+req.body.jenis_kelamin+'" , "'+req.body.npwp+'" , "'+req.body.level_member+'")' };
	
	connection.query(simpan, function(err, result) {
		if (err){
		   console.log(err);
		   res.json({"inserted" : false,"message":err});
		}else{
			//res.json('Inserted: ' + JSON.stringify(rows));
			var insert = result.inserId;
			//SELANJUTNYA INSERT ALAMAT DAN ADDRESS KE TABEL LAIN
		}
	});
			
});

router.put("/perbarui",function(req,res,next) {
	var perbarui = { sql : 'update member set identity_number="'+req.body.identity_number+'", updated_at="'+req.body.updated_at+'", npwp="'+req.body.npwp+'", total_komisi="'+req.body.total_komisi+'", total_saldo="'+req.body.total_saldo+'" where (id_member="'+req.body.id_member+'")' };
	connection.query(perbarui, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Updated: ' + JSON.stringify(rows));
			res.json({"status" : "updated"});
		}
	});
				
});

router.delete("/hapus",function(req,res,next) {
	var hapus = { sql : 'delete from member where id_member="'+req.body.id_member+'"' }
	connection.query(hapus, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Deleted: ' + JSON.stringify(rows));
			res.json({"status" : "deleted"});
		}
	});
				
});

module.exports = router;