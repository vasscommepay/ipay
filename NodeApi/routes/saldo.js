var express 	= require('express');
var async 		= require('async');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var connection  = require('./db');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function (req, res, next) {
 	var member_id 			= connection.escape(req.body.member_id);
 	var jumlah_transaksi	= connection.escape(req.body.jumlah_transaksi);
 	var jenis_mutasi		= connection.escape(req.body.jenis_mutasi);
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
				if(rows[0].result===0){
					res.json({"status":"error","message":"Session tidak terdaftar"});
				}else{
					next();
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
});


router.post("/tampil-get",function(req, res, next) {
var tampilGet = { sql : 'SELECT * from mutasi_saldo_member' }

	connection.query(tampilGet, function(err, rows, fields) {
		if (err){
		   	console.log(err);
		   	res.json({"status":"error","message":err});
		}else{
			res.json(rows);
			console.log(rows);
		}
	});
});

router.post("/tambah-saldo", function(req,res,next){
	var member_id;	
	async.series([
		function(callback){
        	var getIdMember ='SELECT id_member from member where id_member="'+req.body.id_member+'"';
        	connection.query(getIdMember,function(err,rows){
        		if (err){
				   console.log(err);
				}else{
					if (rows[0]==null){
						res.json({"Status" : false , "Message" : "Member ID Not Exist"});
						console.log('Message : Member ID Belum Terdaftar');
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
        	var addNewUsers = {sql : 'INSERT INTO mutasi_saldo_member (jumlah_transaksi,jenis_mutasi,debet,member_id)VALUES("'+req.body.jumlah_transaksi+'","'+req.body.jenis_mutasi+'",0,"'+member_id+'")'};
        	connection.query(addNewUsers, function(err, result) {
				if (err){
					console.log(err);
					res.json({"Inserted" : false , "Message" : err});
					console.log('Message : Saldo Tidak Berhasil Ditambahkan');
				}else{
					res.json({"Inserted" : true , "message" : "success"});
					console.log('Message : Saldo Berhasil Ditambahkan');
				}
			});
        });
});

module.exports = async;
module.exports = router;