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

router.get("/",function(req,res,next) {
//var get_member = {sql : 'SELECT * from member'}

	connection.query('SELECT * from member', function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			res.json(rows);
		}
	});
});

router.post("/",function(req,res,next) {
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query('insert into member (id_member, identity_number, created_at, updated_at, npwp, total_komisi, total_saldo) values ("'+req.body.id_member+'" , "'+req.body.identity_number+'" , "'+req.body.created_at+'" , "'+req.body.updated_at+'" , "'+req.body.npwp+'" , "'+req.body.total_komisi+'" , "'+req.body.total_saldo+'")', function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							res.json('Inserted: ' + JSON.stringify(rows));
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


router.put("/",function(req,res,next) {
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query('update member set identity_number="'+req.body.identity_number+'", created_at="'+req.body.created_at+'", updated_at="'+req.body.updated_at+'", npwp="'+req.body.npwp+'", total_komisi="'+req.body.total_komisi+'", total_saldo="'+req.body.total_saldo+'" where (id_member="'+req.body.id_member+'")', function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							res.json('Updated: ' + JSON.stringify(rows));
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

router.delete("/",function(req,res,next) {
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query('delete from member where id_member="'+req.body.id_member+'"', function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
							res.json('Deleted: ' + JSON.stringify(rows));
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