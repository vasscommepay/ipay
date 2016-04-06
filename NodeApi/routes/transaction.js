var express    = require('express');
var async      = require('async');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var nano   = require('nano')('https://couchdb-8d8a45.smileupps.com')
	, username = 'admin'
	  , userpass = '8c18747889e9'
	  , callback = console.log // this would normally be some callback
	  , cookies  = {} // store cookies, normally redis or something
	  ;
var app = express();
var schedule = require('node-schedule');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var supplier_db = nano.db.use('ipay_supplier');
var transaction_db = nano.db.use('ipay_transaction');	

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
			getSaldo(id_member,function(err,saldo){
				if(err) return callback(err);
				total_saldo = saldo;
				callback();
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
				cekProduk(id_produk,function(err,status){
					console.log(status);
					prod_stat.push(status);
					callback();
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

function getSaldo(id_member,callback){
	connection.query(sql,[id_member],function(err,rows){
		if(err){
			console.log(err);
		}else{
			if(rows.length==0) {
				res.json({"status":"error","message":"data tidak ditemukan"});
			}else{
				var saldo = rows[0].total_saldo;//saldo member saat ini
				callback(null,saldo);
			}
		}
	});
}

function cekProduk(id_produk,callback){
	produk.get(id_produk,function(err,rows){
	    var status ={};	
		if(err){
			console.log(err);
			res.json({"status":"error","message":err});
			return callback(err);
		}else{
			var harga_jual = rows.harga_jual;
			var harga_jual_member = harga_jual[id_uplink];
			var total = harga_jual_member*qty;
			var status_aktif = rows.aktif;  
			var status_kosong = rows.kosong;
			var status_transaksi = false;
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
			console.log("add transaksi sukses");
			callback(null,status);
		}
	});
}

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
	var status_biller = true;
	var harga_biller;
	var status_order;
	var isCheck = req.body.isCheck;
	var prod_stat = [];
	var produk_db = nano.db.use('ipay_produk');
	
	var list_transaksi=[];
	async.each(produks, function(produk, callback){//Transaksi untuk setiap produk

		var id_produk = produk.id_produk;
		console.log("Mulai transaksi produk: "+id_produk);
		var id_tran;
		var rev;
		var qty = produk.qty;
		var harga_beli;
		var total;
		var stok;		
		var harga_jual;
		var harga_jual_member;
		var tujuan = produk.tujuan;
		var status_stok;
		var status_kosong;
		var status_aktif;
		var isSuccess;
		var status_transaksi=false;
		var status=[];
		status["orderid"]=orderid;
		var list_supplier= [];
		var selected_supplier;
		var harga_supplier;
		var id_transaksi;
		
		async.series([
			function(callback){
				//cek ketersediaan produk
				produk_db.get(id_produk,function(err,rows){	
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
						isSuccess = status_transaksi;
						console.log("Totalbiaya="+total_biaya);
						console.log("add transaksi sukses");
						callback();
					}
				});
			},
			function(callback){
				//catat transaksi
				var sql = "CALL transaksi_sp("+orderid+","+id_member+","+id_uplink+","+qty+",'"+id_produk+"',"+total_biaya+",'-','"+tujuan+"')";
				connection.query(sql,function(err,rows){
					if(err){
						console.log("insert transaksi error, "+err);
						callback();
					}else{
						console.log("catat transaksi sukses");
						var tran = rows[0];
						id_transaksi = tran[0].id_transaksi;
						console.log("id_transaksi: "+id_transaksi);
						status["status_biller"]=false;	
						status["id_transaksi"]=id_transaksi;
						id_tran = id_transaksi;
						callback();
					}
				});
			},
			function(callback){
				//Pilih supplier
				console.log("pilih supplier");
				var len = list_supplier.count;
				if(len==1){
					selected_supplier = list_supplier[1];
					callback();
				}else{	
					console.log(list_supplier);
					console.log(len);
					var i;
					var try_supplier;
					supplier_db.get(id_produk,function(err,rows){
						console.log("GET SUPPLIER");
						if(err){
							console.log(err);
						}else{
							for(i=1;i<len;i++){
								var test_supplier = {};
								test_supplier["is_ready"]=true;
								test_supplier["last_price"]=999999999999999;
								try_supplier = list_supplier[i];
								console.log("try_supplier: "+try_supplier);
								var sup = rows.supplier;
								console.log("sup: "+sup);
								var this_sup = sup[try_supplier];
								console.log("this_sup: "+this_sup);
								var is_ready = this_sup.is_ready;
								var last_price = this_sup.harga_terkini;
								console.log("last_price: "+last_price);
								console.log("is_ready: "+is_ready);
								if(is_ready==1 && last_price<test_supplier["last_price"]){
									test_supplier["last_price"]=last_price;
									selected_supplier = this_sup.id;
								}
								console.log("selected_supplier: "+selected_supplier);
							}
							status["supplier"]=selected_supplier;
							status["tujuan"]=tujuan;
							callback();
						}
					});
				}
			},
			function(callback){
				console.log("Kirim ke biller: "+selected_supplier);
				console.log("+++++++++++++++++++++++TRANSAKSI SUKSES++++++++++++++++++++++++++++")
				callback();
			},
			function(callback){
				transaction_db.insert(status,""+id_transaksi+"",function(err,body){
					if(err) console.log(err);
					rev=body.rev;
					status["tran_rev"] = rev;
					prod_stat.push(status);
					var transaksi={};
					transaksi["id"]=id_transaksi;
					transaksi["rev"]=rev;
					list_transaksi.push(transaksi);
					callback();
				});
				
			}
		],callback);
		
	},
	function(err){
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
			prosesTransaksi(prod_stat);
			prod_stat = [];
	});			
});

router.post('/cekTransaksi',function(req,res){
	var id_transaksi = req.body.id_transaksi;
	transaction_db.get(id_tran,function(err,rows){
		res.json({"status":rows.status_biller});
	})
});

function prosesTransaksi(transaksi ){
	var transaction_db = nano.db.use('ipay_transaction');
	console.log("transaksi: "+transaksi);
	var trans = [];
	var stat = {};
	async.each(transaksi,function(tran,callback){
		var id_tran = tran.id_transaksi;
		console.log("processing id_tran: "+id_tran);
		var supplier = tran.supplier;
		var produk = tran.id_produk;
		var qty = tran.order_qty;
		var tujuan = tran.tujuan;
		var rev = tran.tran_rev;
		var rule = new schedule.RecurrenceRule();
		rule.second = 5;
		var job = new schedule.scheduleJob(rule,function(){
			console.log("callBiller");
			var status = callBiller(supplier,id_tran,rev,tujuan,produk,qty);
			stat[id_tran]=status;
			trans.push(stat);
			console.log(stat);
		});
		
	},function(err){
		console.log(trans);
	});
}

function callBiller(id_supplier,id_transaksi,rev,tujuan,produk,qty){
	var stat = Math.floor(Math.random()*10)%2;
	var i = 0;
	updateStatusBiller(id_transaksi,rev);
	// while(stat!=0 && i<5){
	// 	callBiller(id_supplier);
	// 	i++;
	// }
	return "TRUE";
}


function log(supplier){
	console.log("transaksi dengan biller: "+supplier+", sukses dilakukan");
}
function updateStatusBiller(id_transaksi,rev){
	var transaction_db = nano.db.use('ipay_transaction');
	var harga = Math.random()*100000;
	transaction_db.insert({_id:""+id_transaksi+"" ,_rev:rev,status_biller:true,harga_beli:harga},""+id_transaksi+"",function(err,body){
		if(err) console.log(err);
		console.log("transaksi biller sukses pada: "+Date.now());
	});
}

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