var express = require('express');
var async = require('async');
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

router.post('/createOrder',function(req,res){
	var id_member = req.body.id_member;
	var sql = "INSERT INTO member_order(id_member) VALUES(?)";
	connection.query(sql,[id_member],function(err,result){
		if(err){
			console.log(err);
		}else{
			res.json({"isSuccess":true,"orderid":result.insertId});
		}
	});
});

router.post('/tambahStok',function(req,res){
	var produks = req.body.prod;
	var id_member = req.body.id_member;
	var prod_count = produks.length;
	var index;
	var id_uplink = connection.escape(req.body.id_uplink);
	var orderid = req.body.oderid;
	var total_biaya=0;
	var total_saldo;
	var status_biaya;
	var saldo_cukup;
	var prod_stat = [];
		async.each(produks, function(produk, callback){
			var id_produk = connection.escape(produk.id_produk);
			var qty = produk.qty;
			var harga_beli;
			var total;
			var stok;		
			var harga_jual;
			var tujuan = 'stok';
			var min_order ;
			var max_order;
			var status_stok;
			var status_kosong;
			var status_aktif;
			var status_order;
			var stok_kurang;
			var isReady = false;
			var status_transaksi=false;
			var status=[];
			var sql = 'SELECT * FROM produk_member WHERE product_id ="'+id_produk+'" AND member_id ='+id_uplink;
			connection.query(sql,function(err,rows){
				if(err){
					console.log(err);
					res.json({"status":"error","message":err});
				}else{
					harga_jual = rows[0].harga_jual;
					total = harga_jual*qty;
					status_aktif = rows[0].aktif;
					status_kosong = rows[0].kosong;
					stok = rows[0].stok_produk;
					if(stok-qty < 0){
						status_stok = false;
						stok_kurang = qty-stok;
					}else{
						status_stok = true;
						stok_kurang = 0;
						isReady = true;
					}
					if(min_order<qty && max_order>qty){
						status_order = true;
						isReady = true;
					}else{
						status_order = false;
						isReady = false;
					}
					if(isReady){
						sql = 'INSERT INTO transaksi(id_order,id_produk,id_member_produk,total_biaya,jenis_transaksi) VALUES(?,?,?,?,?)';
						connection.query(sql,[orderid,id_produk,id_uplink,total,"tstk"],function(err,result){
							var id_tran;
							if(err){
								consol.log(err);
							}else{
								status_transaksi = true;
								id_tran = result.insertId;
							}
							status = {
								"id_produk":id_produk,
								"order_qty":qty,
								"harga":harga_jual,
								"total":total,
								"status_aktif":status_aktif,
								"status_kosong":status_kosong,
								"status_stok":status_stok,
								"stok_kurang":stok_kurang,
								"status_order":status_order,
								"min_order":min_order,
								"max_order":max_order,
								"status_transaksi":true,
								"id_transaksi":id_tran
							}
							total_biaya += total;
							console.log("Totalbiaya="+total_biaya);
							prod_stat.push(status);
							callback();
						});
					}
					
				}
			});
		
	},function(err){

		console.log("callback: sukses");
		var sql = "SELECT total_saldo FROM member WHERE id_member = ?";
		connection.query(sql,[id_member],function(err,rows){
			if(err){
				console.log("get_saldo: gagal");
				console.log(err);
				res.json({"status":"error","message":err});
			}else{
				console.log("get_saldo: sukses");
				total_saldo = rows[0].total_saldo;
				if(total_saldo<total_biaya){
					saldo_cukup = false;
				}else{
					saldo_cukup = true;
				}
				var status = [{
					"total_biaya":total_biaya,
					"saldo":total_saldo,
					"saldo_cukup":saldo_cukup,
					"prod_stat":prod_stat
					}];
				res.json(status);
			}
		});
	});
});


module.exports = async;
module.exports = router;