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

router.post("/",function(req,res,next) {
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query('SELECT * from member where id_member ="'+req.body.member_id+'"', function(err, rows, fields) {
						if (err){
						   console.log(err);
						}else{
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

module.exports = router;