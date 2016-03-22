var express = require('express');
var async = require('async');
var crypto = require('crypto');
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

function randomString(length) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@&"
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

router.post("/view-get-users",function(req,res,next) {
var viewGetUsers = {sql : 'SELECT * from users'};
	connection.query(viewGetUsers, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			res.json(rows);
		}
	});
});

router.post("/cek-username",function(req,res,next) {
var cekUsername = {sql : 'SELECT * from users WHERE username="'+req.body.username+'"'};
	connection.query(cekUsername, function(err, rows, fields) {
		if (err){
			console.log(err);
		}else{
			if (rows[0]==null){
				res.json({"status" : "true" , "message" : "username not exist"});
			} else {
				var username = rows[0].username;
				res.json({"status" : "false" , "message" : "username exist"});
			}
		}
	});
});

router.post("/add-new-users",function(req,res,next) {
var password = req.body.password;
var hash = crypto.createHash('md5').update(password).digest("hex");
var member_id;	
	async.series([
		function(callback){
        	var getIdMember ='SELECT id_member from member where reg_num="'+req.body.reg_num+'"';
        	connection.query(getIdMember,function(err,rows){
        		if (err){
				   console.log(err);
				}else{
					if (rows[0]==null){
						res.json({"status" : "false" , "message" : "users not exist"});
					} else {
						member_id = rows[0].id_member;
						callback();
					}
				}
        	});
        }
	],
        function (callback){
        	console.log(member_id);
        	var addNewUsers = {sql : 'INSERT INTO users (username,password,email,member_id)VALUES("'+req.body.username+'","'+hash+'","'+req.body.email+'","'+member_id+'")'};
        	connection.query(addNewUsers, function(err, result) {
				if (err){
					console.log(err);
					res.json({"inserted" : "false" , "message" : err});
				}else{
					res.json({"inserted" : "true" , "message" : "success"});
				}
			});
        });
});

router.put("/ubah-password",function(req,res,next) {
var password = req.body.password;
var hash = crypto.createHash('md5').update(password).digest("hex");
var newPassword = crypto.createHash('md5').update(req.body.newPassword).digest("hex");
var isexists;
	async.series([
		function(callback){
        	var cekPassword = {sql : 'SELECT * from users WHERE password="'+hash+'" and username="'+req.body.username+'"'};
			connection.query(cekPassword, function(err, rows, fields) {
				if (err){
					console.log(err);
				}else{
					if (rows==null){
						res.json({"status" : "false" , "message" : "password missmatch"});
					} else {
						callback();
					}
				}
			});
        }
	],
		function(callback){
			console.log(password);
        	var ubahPassword = {sql : 'UPDATE users SET password="'+newPassword+'" where username="'+req.body.username+'"'};
			connection.query(ubahPassword, function(err, rows, fields) {
				if (err){
					console.log(err);
				}else{
					if (rows==null){
						res.json({"status" : "false" , "message" : "this old password"});
					} else {
						res.json({"status" : "true" , "message" : "password updated"});
					}
				}
			});
        });
});

router.post("/lupa-password",function(req,res,next) {
	var lupaPassword = { sql : 'delete from member where id_member="'+req.body.id_member+'"' }
	connection.query(lupaPassword, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Deleted: ' + JSON.stringify(rows));
			res.json({"status" : "deleted"});
		}
	});
				
});

module.exports = router;