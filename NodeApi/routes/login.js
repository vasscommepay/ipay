var express    = require('express');
var crypto     = require('crypto');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection  = require('./db');
var async 		= require('async');
var nano   = require('./nano');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router.post("/",function(req,res,next) {


//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}
	var username = req.body.username;
	var password = req.body.password;
	var hash = crypto.createHash('md5').update(password).digest("hex");
	var session_status;
	var session =randomString(10);
	async.whilst(
		function(){
			connection.query('Select EXISTS(SELECT * from users Where session="'+session+'" and username = "'+username+'") as result',function(err, rows, fields){
				if(err){
					console.log(err);
				}else{
					if(rows.result===1){
						console.log("nousers");
						return session_status = false;
					}else{
						return session_status = true;
					}
				}
			});
		},
		function(callback){
			var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		    var result = '';
		    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		   	session = result;
		    callback(null, session);
		},
		function(err,n){
			var queryString = 'SELECT * from users LEFT JOIN member ON member_id = id_member where username ="'+username+'" and password="'+hash+'" ';
				connection.query(queryString, function(err, rows, fields) {
				if (err){
				   console.log(err);
				   console.log(queryString);
				   res.json({"isLogin":false,"message":err});
				}else{
					if(rows.length>0){
						var memberid = rows[0].member_id;
						var level = rows[0].level_member;
						var saldo = rows[0].total_saldo;
						var komisi = rows[0].total_komisi;
						var nama = rows[0].nama;
						console.log(level);
						var sqlAtasan;
						if(level==2){
			        		sqlAtasan = "SELECT id_korwil as atasan FROM member_koordinator WHERE id_member ="+memberid;
			        	}else if(level==3){
			        		sqlAtasan = "SELECT id_koordinator as atasan FROM member_agen WHERE id_member ="+memberid;
			        	}else{
			        		sqlAtasan = "SELECT id_member as atasan FROM member_internal";
			        	}
						setSession(username,session);
						connection.query(sqlAtasan,function(err,rows){
							if (err){
							   console.log(err);
							   res.json({"selected" : false,"message":err});
							}else{
								if(rows[0]==null){
									res.json({"available" : false,"message":err});
								}else{
									var uplink = rows[0].atasan;
									if(level==0)uplink=1;
									res.json({"isLogin":"true","saldo":saldo,"komisi":komisi,"nama":nama,"member_id":memberid,"session":session,"level":level,"uplink":uplink});
								}
							}
						});
						
					}else{
						res.json({"isLogin":false,"message":"User tidak terdaftar"});
					}
				}
			});
		}

	);

});
// 	var queryString = 'SELECT * from users LEFT JOIN member ON member_id = id_member where username ="'+username+'" and password="'+hash+'" ';
// 	connection.query(queryString, function(err, rows, fields) {
// 		if (err){
// 		   console.log(err);
// 		   console.log(queryString);
// 		   res.json({"status":"error","message":queryString});
// 		}else{
// 			if(rows.length>0){
// 				var session = randomString(10);
// 				var check = checkSession(session);
// 				var memberid = rows[0].member_id;
// 				var level = rows[0].level_member;
// 				while(check){
// 					session = randomString(10);
// 					check = checkSession(session);
// 				}
// 				var memberlevel;
// 				setSession(username,session);
// 				console.log(lv);
// 				res.json({"isLogin":"true","member_id":memberid,"session":session,"level":level});
// 			}else{
// 				res.json({"status":queryString});
// 			}
// 		}
// 	});
// });

function randomString(length) {
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@&"
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
// function checkSession(session){
// 	var retval;
// 	connection.query('Select EXISTS(SELECT * from users Where session="'+session+'") as result',function(err, rows, fields){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			if(rows.result===1){
// 				retval = "false";
// 				return false;
// 			}else{
// 				return true;
// 				retval = "true";
// 			}
// 		}
// 	});
// }
function setSession(username, session){
	connection.query('UPDATE users SET session ="'+session+'" WHERE username = "'+username+'" ',function(err, rows, fields){

		if(err){
			console.log(err);
		}else{
			updateCouch(username,session);
			console.log("userlogin, username: "+username+" session: "+session);
			if(rows.result===1){
				return true;
				
			}else{
				return false;
			}
		}
	});
}
function updateCouch(username,session){
	var member_db = nano.db.use('ipay_users');
	member_db.get(username,function(err,body){
		if(err){
			console.log(err);
		}else{
			body["session"]=session;
			body["updated_at"]= Date.now();
			delete body.rev;
			member_db.insert(body,function(err,body){
				if(err){
					console.log(err);
				}else{
					console.log("couch users updated");
				}
			});
		}
	});
}
module.exports = router;