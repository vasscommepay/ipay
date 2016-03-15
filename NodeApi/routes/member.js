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

router.get("/tampil-get",function(req, res, next) {
var tampilGet = { sql : 'SELECT * from member' }

	connection.query(tampilGet, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			res.json(rows);
		}
	});
});

router.post("/tampil-post",function(req, res, next) {
var tampilPost = { sql : 'SELECT * from member where id_member="'+req.body.id_member+'"' }
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query(tampilPost, function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							//res.json('Inserted: ' + JSON.stringify(rows));
							res.json(rows);
						}
					});
				}else{
					res.json({"status":"session tidak terdaftar"});
				}
			}
		});
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});


router.post("/simpan",function(req, res, next) {
var simpan = { sql : 'insert into member (identity_number, npwp, level_member) values ("'+req.body.identity_number+'" , "'+req.body.npwp+'" , "'+req.body.level_member+'")' }
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query(simpan, function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							//res.json('Inserted: ' + JSON.stringify(rows));
							res.json({"status" : "inserted"});
						}
					});
				}else{
					res.json({"status":"session tidak terdaftar"});
				}
			}
		});
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});


router.put("/perbarui",function(req,res,next) {
var perbarui = { sql : 'update member set identity_number="'+req.body.identity_number+'", updated_at="'+req.body.updated_at+'", npwp="'+req.body.npwp+'", total_komisi="'+req.body.total_komisi+'", total_saldo="'+req.body.total_saldo+'" where (id_member="'+req.body.id_member+'")' }
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query(perbarui, function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							//res.json('Updated: ' + JSON.stringify(rows));
							res.json({"status" : "updated"});
						}
					});
				}else{
					res.json({"status":"session tidak terdaftar"});
				}
			}
		});
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});

router.delete("/hapus",function(req,res,next) {
var hapus = { sql : 'delete from member where id_member="'+req.body.id_member+'"' }
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query(hapus, function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							//res.json('Deleted: ' + JSON.stringify(rows));
							res.json({"status" : "deleted"});
						}
					});
				}else{
					res.json({"status":"session tidak terdaftar"});
				}
			}
		});
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});

module.exports = router;