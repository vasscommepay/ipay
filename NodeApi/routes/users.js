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
				res.json({"status" : "true" , "message" : "users not exist"});
			} else {
				var username = rows[0].username;
				res.json({"status" : "false" , "message" : "users exist"});
			}
		}
	});
});

router.post("/add-new-users",function(req,res,next) {
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
						res.json({"status" : "false" , "message" : "member not exist"});
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
        	var addNewUsers = {sql : 'INSERT INTO users (username,password,email,member_id)VALUES("'+req.body.username+'","'+req.body.hash+'","'+req.body.email+'","'+member_id+'")'};
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
var hash = crypto.createHash('md5').update(password).digest("hex");
var ubahPassword = {sql : 'UPDATE users SET password="'+req.body.hash+'" where (username="'+req.body.username+'")'};
	connection.query(ubahPassword, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			res.json({"updated" : "true" , "message" : "password updated success"});
		}
	});
});

module.exports = router;