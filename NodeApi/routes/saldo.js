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
	var username = connection.escape(req.body.username);
	var nama_pembayar = req.body.nama_pembayar;
	var rekening = req.body.rekening;
	var jalur_pembayar = req.body.jalur;
	var status=true;
	var id_mutasi;
	var id_transaksi;
	var kode_order = createKodeOrder(4);
	//console.log("SQL: "+sql);
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
			var biaya = jumlah_transaksi;
			var sql_query = "INSERT INTO member_order(id_order,id_member,biaya_total,status) VALUES('"+kode_order+"',"+member_id+","+jumlah_transaksi+",'sc')";
			connection.query(sql_query,function(err,result){
				if(err){
					callback(err);
				}else{
					console.log('new order inserted');
					callback();
				}
			});
		}
		,function(callback){
			var sql_query = "INSERT INTO transaksi(id_order,id_produk,id_member_produk,username,quantities,tujuan,status,total_biaya) VALUES('"+kode_order+"','deposit',"+uplink+","+username+",1,"+member_id+",'sc',"+jumlah_transaksi+")";
			connection.query(sql_query,function(err,result){
				if(err){
					callback(err);
				}else{
					console.log('new tran inserted');
					id_transaksi = result.insertId;
					callback();
				}
			});
		}
		,function(callback){
			var sql = "Call tambah_saldo('"+kode_order+"',"+id_transaksi+","+member_id+","+jumlah_transaksi+",'tambah',"+uplink+",'"+nama_pembayar+"','"+rekening+"','"+jalur_pembayar+"')";
			console.log(sql);	
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

function createKodeOrder(length){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    var d = new Date();
    var day = d.getDate();
    var mon = d.getMonth();
    var month = 0;
    var h = d.getHours();
    var hour = 0;
    if(mon<10){
    	month = '0'.concat((mon+1));
    }else{
    	month = mon+1;
    }
    var year = d.getFullYear();
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    var date = day.toString()+month.toString()+year.toString().substring(2,4);
	return date+result;
}
module.exports = router;