var express = require('express');
var async = require('async');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var connection = mysql.createConnection({
   host     : '10.0.0.19',
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

router.post('/tambahStok',function(req,res){
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
	var isCheck = req.body.isCheck;
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
			var isSuccess;
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
					min_order = rows[0].min_order_qty;
					max_order = rows[0].max_order_qty;   
					status_kosong = rows[0].kosong;
					stok = rows[0].stok_produk;

					if(stok-qty < 0){
						status_stok = false;
						stok_kurang = qty-stok;
					}else{
						status_stok = true;
						stok_kurang = 0;
					}
					if(min_order<=qty && max_order>=qty){
						status_order = true;
					}else{
						status_order = false;
					}

					if(status_aktif==1 && status_kosong==0 && status_stok && status_order){
						isReady = true;
					}else{
						isReady = false;
					}
					if(isReady && !isCheck){
						console.log("cek transaksi sukses");
						sql = 'INSERT INTO transaksi(id_order,id_produk,id_member_produk,total_biaya,jenis_transaksi) VALUES('+orderid+',"'+id_produk+'",'+id_uplink+','+total+',"tstk")';
						connection.query(sql,function(err,result){
							var id_tran;
							if(err){
								status_transaksi = false;
								console.log("Insert transaksi gagal");
								console.log(err);
							}else{
								console.log("Insert transaksi sukses");
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
								"status_transaksi":status_transaksi,
								"id_transaksi":id_tran
							}
							total_biaya += total;
							console.log("Totalbiaya="+total_biaya);
							prod_stat.push(status);
							console.log("add transaksi sukses");
							
						});
						callback();
					}else{
						status_transaksi = false;
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
								"status_transaksi":status_transaksi,
								"id_transaksi":null
							}
							total_biaya += total;
							isSuccess = status_transaksi;
							console.log("Totalbiaya="+total_biaya);
							prod_stat.push(status);
							console.log("add transaksi sukses");
							callback();
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
					"isSuccess":isSuccess,
					"total_biaya":total_biaya,
					"saldo":total_saldo,
					"saldo_cukup":saldo_cukup,
					"prod_stat":prod_stat
					}];
				if(saldo_cukup && !isCheck){
					  
				}
				res.json(status);
			}
		});
	});
});

function updateTabelOrder(orderid,biaya,status){
	var biaya = connection.escape(biaya);
	var status = connection.escape(status);
	var sql = 'UPDATE member_order SET biaya_total='+biaya+'status="'+status+'"';
	connection.query(sql,function(err,result){
		if(err){
			console.log("update order gagal");
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