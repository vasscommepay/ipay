var express 	= require('express');
var async 		= require('async');
var crypto 		= require('crypto');
//var nodemailer	= require('nodemailer');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var mysql      	= require('mysql');
var connection 	= mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'ipaydb'
});

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var app = require('express')(),
    mailer = require('express-mailer');


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
			console.log(rows);
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
				res.json({"Status" : false , "Message" : "Username Not Exist"});
				console.log('Message : Username Tidak Terdaftar');
			} else {
				// var username = rows[0].username;
				res.json({"Status" : true , "Message" : "Username Exist"});
				console.log('Message : Username Sudah Terdaftar');
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
						res.json({"Status" : false , "Message" : "Users Not Exist"});
						console.log('Message : User Belum Terdaftar');
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
					res.json({"Inserted" : false , "Message" : err});
					console.log('Message : User Tidak Berhasil Didaftarkan');
				}else{
					res.json({"Inserted" : true , "Message" : "Success"});
					console.log('Message : User Berhasil Didaftarkan');
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
						res.json({"Status" : false , "Message" : "Password Missmatch"});
						console.log('Message : Password Tidak Cocok');
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
						res.json({"Status" : false , "Message" : "This Old Password"});
						console.log('Message : Ini Password Lama Anda');
					} else {
						res.json({"Status" : true , "Message" : "Password Updated"});
						console.log('Message : Password Berhasil Diperbarui');
					}
				}
			});
        });
});

// router.post("/lupa-password",function(req,res,next) {
// 	var lupaPassword = { sql : 'delete from member where id_member="'+req.body.id_member+'"' }
// 	connection.query(lupaPassword, function(err, rows, fields) {
// 		if (err){
// 		   console.log(err);
// 		}else{
// 			//res.json('Deleted: ' + JSON.stringify(rows));
// 			res.json({"status" : "deleted"});
// 		}
// 	});
// });


// router.post('/send-password',function(req,res){


// var contact = {subject: 'test', message: 'test message', email: 'bfibrianto@gmail.com'};
// var to = "sarahmuyassaroh@gmail.com";


// var smtpConfig = {
//     host: 'smtp.gmail.com',
//     secure:false,
//     port: 465,
//     //proxy: 'http://localhost:5000/',
//     auth: {
//         user: 'bfibrianto@gmail.com',
//         pass: 'kitibriti'
//     }
// };

// var transport = nodemailer.createTransport('SMTP',{
//     service: 'gmail',
//     auth: {
//         user: 'bfibrianto@gmail.com',
//         pass: 'kitibriti'
//     }
// });

// var directConfig = {
//     name: 'localhost' // must be the same that can be reverse resolved by DNS for your IP
// };

//     var mailOptions={
//         from : contact.email,
//         to : to,
//         subject : contact.subject,
//         text : contact.message
//     }
//     transport.sendMail(mailOptions, function(err, info){
// 		if(err){
// 			console.log(err);
// 			//res.end('err');
// 		}else{
// 			console.log('Message sent: ' + info.message);
// 			//res.end('sent');
// 		}
// 	});

// });

router.post('/mail', function(req, res){
    mailer.extend(app,{
    from: req.body.email,
    host:'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
     auth: {
         user: 'example@gmail.com',
         pass: '**********'
     }

  });
       app.mailer.send('email',{
       to: 'gallan.widyanto@gmail.com',
       subject: req.body.subject,
       message: req.body.message

  }, function(err){
    if(err){
       console.log('error');
       //return
    }
     res.send('email sent');
 });
});

module.exports = router;