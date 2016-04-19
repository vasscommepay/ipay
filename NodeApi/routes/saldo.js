var express 	= require('express');
var async 		= require('async');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var connection  = require('./db');
var couchdb = require('./couchdbfunction');
var nano = require('./nano');
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

router.post("/tambah-saldo", function(req,res){
	var member_id = req.body.id_member;
	var uplink = req.body.uplink;
	var jumlah_transaksi = req.body.jumlah;
	var nama_pembayar = req.body.nama_pembayar;
	var rekening = req.body.rekening;
	var jalur_pembayar = req.body.jalur;
	var status=true;
	var id_mutasi;
	var sql = "Call tambah_saldo("+member_id+","+jumlah_transaksi+",'tambah',"+uplink+",'"+nama_pembayar+"','"+rekening+"','"+jalur_pembayar+"')";	
	console.log("SQL: "+sql);
	async.series([
		function(callback){
			console.log('cekSaldo');
			cekSaldo(uplink,function(err,result){
				if(err){
					callback(err);
				}else{
					if(result>jumlah_transaksi){
						callback();
						console.log('saldo cukup: '+result);
					}else{
						callback('Saldo '+uplink+' tidak cukup untuk menambah saldo downlink anda: '+result);
					}
				}
			})
		}
		,function(callback){
			connection.query(sql,function(err,result){
				if(err){
					callback(err);
				}else{
					//console.log("res: %j",result[0][0].saldo_akhir_mem);
					var saldo_akhir_mem = result[0][0].saldo_akhir_mem;
					var saldo_akhir_up = result[0][0].saldo_akhir_up;
					couchdb.updateDb('ipay_member',member_id,{'saldo':saldo_akhir_mem},function(err,body){});
					couchdb.updateDb('ipay_member',uplink,{'saldo':saldo_akhir_up},function(err,body){});
					id_mutasi = result[0].id_mutasi;
					callback();
				}
			});
		}
	]
	,function(err){
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
		}else{
			res.json({"error":false,"mutasi":id_mutasi});
		}
	});
	

});

function cekSaldo(id_member,callback){
	var member_db = nano.db.use('ipay_member');
	member_db.get(id_member,function(err,body){
		if(err){
			callback(err);
		}else{
			if(body.length==0){
				err = "No record found";
				callback(err);
			}else{
				//console.log(body);
				var saldo = body.saldo;
				callback(null,saldo);
			}
		}
	});
}
module.exports = router;