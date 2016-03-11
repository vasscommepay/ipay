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
		if(checkSession(session)){
			connection.query('SELECT * from users where member_id ="'+req.body.member_id+'"', function(err, rows, fields) {
				if (err){
				   console.log(err);
				}else{
					res.json(rows);
				}
			});
		}else{
			res.json({"status":"session tidak terdaftar"});
		}
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});

function checkSession(session){
	connection.query('Select EXISTS(SELECT * from users Where session="'+session+'") as result',function(err, rows, fields){
		if(err){
			console.log(err);
		}else{
			if(rows.result===1){
				return true;
			}else{
				return false;
			}
		}
	});
}

module.exports = router;