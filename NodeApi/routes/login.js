
var crypto = require('crypto');
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
var lv;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router.post("/",function(req,res,next) {
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var username = req.body.username;
	var password = req.body.password;
	var hash = crypto.createHash('md5').update(password).digest("hex");
	var queryString = 'SELECT * from users LEFT JOIN member ON member_id = id_member where username ="'+username+'" and password="'+hash+'" '
	;
	connection.query(queryString, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   console.log(queryString);
		   res.json({"status":"error","message":queryString});
		}else{
			if(rows.length>0){
				var session = randomString(10);
				var check = checkSession(session);
				var memberid = rows[0].member_id;
				var level = rows[0].level_member;
				while(check){
					session = randomString(10);
					check = checkSession(session);
				}
				var memberlevel;
				setSession(username,session);
				console.log(lv);
				res.json({"isLogin":"true","member_id":memberid,"session":session,"level":level});
			}else{
				res.json({"status":queryString});
			}
		}
	});
});

function randomString(length) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@&"
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function checkSession(session){
	var retval;
	connection.query('Select EXISTS(SELECT * from users Where session="'+session+'") as result',function(err, rows, fields){
		if(err){
			console.log(err);
		}else{
			if(rows.result===1){
				retval = "false";
				return false;
			}else{
				return true;
				retval = "true";
			}
		}
	});
}
function setSession(username, session){
	connection.query('UPDATE users SET session ="'+session+'" WHERE username = "'+username+'" ',function(err, rows, fields){

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