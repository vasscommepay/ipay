var express    = require('express');
var async      = require('async');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');

var nano   = require('nano')('http://localhost:5984');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(function(req, res, next) {//Untuk cek apakah ada session
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
					console.log("session sukses");
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
	var kode_order = createKodeOrder(8);
	var sql = "INSERT INTO member_order(id_member,kode_order) VALUES(?,?)";
	connection.query(sql,[id_member,kode_order],function(err,result){
		if(err){
			console.log(err);
		}else{
			res.json({"isSuccess":true,"orderid":result.insertId});
		}
	});
});


router.post('/simulasiTransaksi',function(req,res){//UNTUK TRANSAKSI
	var produks = req.body.prod;
	var id_member = req.body.id_member;
	var prod_count = produks.length;
	var index;
	var id_uplink = connection.escape(req.body.id_uplink);
	var orderid = req.body.orderid;
	var total_biaya=0;
	var total_saldo;
	var status_biaya;
	var saldo_cukup;
	var isSuccess;
	var status_order;
	var isCheck = req.body.isCheck;
	var prod_stat = [];
	var sql = "SELECT total_saldo FROM member WHERE id_member = ?";
	async.series([
		function(callback){//Mendapatkan saldo member untuk cek apakah saldo cukup
			connection.query(sql,[id_member],function(err,rows){
				if(err){
					console.log(err);
				}else{
					if(rows.length==0) {
						res.json({"status":"error","message":"data tidak ditemukan"});
					}else{
						total_saldo = rows[0].total_saldo;//saldo member saat ini
						callback();
					}
				}
			});
		},
		function(callback){    
			async.each(produks, function(produk, callback){//Transaksi untuk setiap produk
				var id_produk = produk.id_produk;
				var qty = produk.qty;
				var harga_beli;
				var total;
				var stok;		
				var harga_jual;
				var harga_jual_member;
				var tujuan = req.body.tujuan;
				var status_stok;
				var status_kosong;
				var status_aktif;
				var isSuccess;
				var status_transaksi=false;
				var status=[];
				var supplier;
				var harga_supplier;
				var produk = nano.db.use('ipay_produk');
				produk.get(id_produk,function(err,rows){	
					if(err){
						console.log(err);
						res.json({"status":"error","message":err});
					}else{
						harga_jual = rows.harga_jual;
						harga_jual_member = harga_jual[id_uplink];
						total = harga_jual_member*qty;
						status_aktif = rows.aktif;  
						status_kosong = rows.kosong;
						status_transaksi = false;
						if(status_aktif && !status_kosong) status_transaksi = true;
						status = {
								"status_transaksi":status_transaksi,
								"id_produk":id_produk,
								"order_qty":qty,
								"harga":harga_jual_member,
								"total":total,
								"status_aktif":status_aktif,
								"status_kosong":status_kosong
							}
						total_biaya += total;
						total_saldo = total_saldo-total_biaya;
						isSuccess = status_transaksi;
						console.log("Totalbiaya="+total_biaya);
						prod_stat.push(status);
						console.log("add transaksi sukses");
						callback();
					}
				});
			
			},callback);
			
		}
	],
		function(err){
			console.log("callback: sukses");
				if(total_saldo<total_biaya){
					saldo_cukup = false;
				}else{
					saldo_cukup = true;
				}
				status_order = [{
					"isSuccess":isSuccess,
					"total_biaya":total_biaya,
					"saldo":total_saldo,
					"saldo_cukup":saldo_cukup,
					"prod_stat":prod_stat
					}];
				res.json(status_order);
		});			
});



router.post('/transaksi',function(req,res){//UNTUK TRANSAKSI
	var produks = req.body.prod;
	var id_member = req.body.id_member;
	var prod_count = produks.length;
	var index;
	var id_uplink = connection.escape(req.body.id_uplink);
	var orderid = req.body.orderid;
	var total_biaya=0;
	var total_saldo;
	var status_biaya;
	var saldo_cukup;
	var isSuccess;
	var status_order;
	var isCheck = req.body.isCheck;
	var prod_stat = [];
	async.each(produks, function(produk, callback){//Transaksi untuk setiap produk
		var id_produk = produk.id_produk;
		var qty = produk.qty;
		var harga_beli;
		var total;
		var stok;		
		var harga_jual;
		var harga_jual_member;
		var tujuan = req.body.tujuan;
		var status_stok;
		var status_kosong;
		var status_aktif;
		var isSuccess;
		var status_transaksi=false;
		var status=[];
		var list_supplier= [];
		var supplier;
		var harga_supplier;
		var id_transaksi;
		var produk = nano.db.use('ipay_produk');
		async.series([
			function(callback){
				//cek ketersediaan produk
				produk.get(id_produk,function(err,rows){	
					if(err){
						console.log(err);
						res.json({"status":"error","message":err});
					}else{
						harga_jual = rows.harga_jual;
						harga_jual_member = harga_jual[id_uplink];
						list_supplier = rows.supplier;
						total = harga_jual_member*qty;
						status_aktif = rows.aktif;  
						status_kosong = rows.kosong;
						status_transaksi = false;
						if(status_aktif && !status_kosong) status_transaksi = true;
						status = {
								"status_transaksi":status_transaksi,
								"id_produk":id_produk,
								"order_qty":qty,
								"harga":harga_jual_member,
								"total":total,
								"status_aktif":status_aktif,
								"status_kosong":status_kosong
							}
						total_biaya += total;
						total_saldo = total_saldo-total_biaya;
						isSuccess = status_transaksi;
						console.log("Totalbiaya="+total_biaya);
						console.log("add transaksi sukses");
						callback();
					}
				});
			},
			function(callback){
				//catat transaksi
				var sql = "CALL transaksi_sp("+orderid+","+id_member+","+id_uplink+","+qty+","+id_produk+","+total_biaya+",'"+supplier+"',"+tujuan+"')";
				connection.query(sql,function(err,rows){
					if(err){
						console.log("insert transaksi error, "+err);
						callback();
					}else{
						id_transaksi = rows[0].id_transaksi;
						status["id_transaksi"]=id_transaksi;
						callback();
						prod_stat.push(status);
					}
				});
			}
		],callback);
		
	},
	function(err){
		console.log("callback: sukses");
			if(total_saldo<total_biaya){
				saldo_cukup = false;
			}else{
				saldo_cukup = true;
			}
			status_order = [{
				"isSuccess":isSuccess,
				"total_biaya":total_biaya,
				"saldo":total_saldo,
				"saldo_cukup":saldo_cukup,
				"prod_stat":prod_stat
				}];
			res.json(status_order);
	});			
});





function updateTabelOrder(orderid,biaya,status){
	var biaya = connection.escape(biaya);
	var status = connection.escape(status);
	var sql = 'UPDATE member_order SET biaya_total='+biaya+'status="'+status+'"';
	connection.query(sql,function(err,result){
		if(err){
			console.log("update ordre gagal");
			console.log(err);
		}else{
			console.log("update order sukses");
		}
	});
}

function createKodeOrder(length){
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
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
    var date = day.toString()+month.toString()+year.toString();
	return "OR"+date+result;
}

module.exports = async;
module.exports = router;