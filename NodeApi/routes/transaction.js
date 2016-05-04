var express    	= require('express');
var async      	= require('async');
var router    	= express.Router();
var logger        = require('morgan');
var bodyParser 	= require('body-parser');
var crypto     = require('crypto');
var connection 	= require('./db');
var nano   		= require('./nano');
var request 	= require("request");
var app 		= express();
var couchdb 	= require('./couchdbfunction');
var cek_session = require('./session');
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var supplier_db = nano.db.use('ipay_supplier');
var transaction_db = nano.db.use('ipay_transaction');
var produk_db = nano.db.use('ipay_produk');	
var member_db = nano.db.use('ipay_member');

var username;
router.post('/sendRespond',function(req,res){
	var respond = req.body;
	console.log(respond);
});

router.use(function(req, res, next) {//Untuk cek apakah ada session
	console.log(req.method, req.url);
	var session = req.body.session;
	if(session!=null){
		cek_session(session,function(err,exists,timeout,username){
			if(err){
				res.json({"error":true,"message":err});
			}else{
				if(exists){
					req.username = username;
					console.log('username: ',username);
					next();
				}else if(timeout){
					req.username = username;
					console.log('username: ',username);
					res.json({"error":true,"timeout":true});
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
});

router.post('/cekHarga',function(req,res){
	var id_member = req.body.id_member;
	var tujuan = req.body.tujuan;
	var id_produk = req.body.id_produk;
	produk_db.get(id_produk,function(err,body){
		if(err){
			res.json({'error':true,'message':err});
		}else{
			var harga = body.harga_beli[id_member];
			var kosong = body.kosong;
			var aktif = body.aktif;
			var tipe = body.tipe;
			console.log(body.harga_beli[id_member]);
			if(tipe=='postpaid'){
				getPostpaidBill(id_produk,tujuan,function(err,bill){
					if(err){
						console.log(err);
						res.json({'error':true,'msg':err});
					}else{
						harga = bill;
						console.log('harga: ',bill);
						res.json({'error':false,'harga':harga,'kosong':kosong,'aktif':aktif});
						//couchdb.activityLog(username,req.url,res);
					}
				});
			}else{
				console.log('%j',body);
				res.json({'error':false,'harga':harga,'kosong':kosong,'aktif':aktif});
			}
		}
	});
});

router.post('/cekOrder',function(req,res){
	var id_order = req.body.id_order;
	//console.log(id_order);
	transaction_db.view('transaction','by_order',{keys:[id_order]},function(err,body){
		if(err){
			res.json({'error':true,'message':err});
			couchdb.activityLog(req.username,req.url,err,res.statusCode,function(err,body){});
		}else if(body.length==0){
			err = 'not found';
			res.json({'error':true,'message':'not found'});
			couchdb.activityLog(req.username,req.url,err,res.statusCode,function(err,body){});
		}else{
			var status_order = {};
			var total = 0;
			var rows = [];
			var len = body.rows.length;
			var timestamp;
			status_order['jumlah_tr'] = len;
			for(var i = 0;i<len;i++){
				var value = body.rows[i].value;
				delete value.supplier;
				delete value.new_trans;
				delete value.id_korwil;
				delete value.id_koor;
				delete value.id_member;
				delete value._id;
				delete value._rev;
				timestamp = value.timestamp;
				total=+value.total;
				rows.push(value);
			}
			var date = new Date(timestamp);
			status_order['timestamp']=date.toUTCString();
			status_order['total']=total;
			status_order['trans']=rows;
			res.json(status_order);
			var respond = status_order;
			couchdb.activityLog(req.username,req.url,respond,res.statusCode,function(err,body){});
			//console.log('order: %j',status_order);
		}
	})
});

router.post('/getMutasi',function(req,res){
	var id_member = req.body.id_member;
	var id = connection.escape(id_member);
	var level = req.body.level;
	var sql_query;
	if(level==2){
		sql_query = "SELECT * FROM mutasi_saldo_member WHERE id_member ="+id+" OR id_member IN (SELECT id_member FROM member_agen WHERE id_koordinator ="+id+")";
	}else if(level==3){
		sql_query = "SELECT * FROM mutasi_saldo_member WHERE id_member ="+id;
	}else if(level == 0){
		sql_query = "SELECT * FROM mutasi_saldo_member WHERE id_member ="+id;
	}else{
		sql_query = "SELECT * FROM mutasi_saldo_member WHERE id_member ="+id+" OR id_member IN (SELECT id_member FROM member_koordinator WHERE id_korwil ="+id+")";
	}
	sql_query = sql_query+" ORDER BY id DESC";
	console.log(sql_query, "level: ",level);
	console.log(req.username);
	getData(sql_query,function(err,rows){
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
			couchdb.activityLog(req.username,req.url,err,res.statusCode,function(err,body){});
		}else{
			res.json(rows);
			//console.log('res: %c',res);
			couchdb.activityLog(req.username,req.url,rows,res.statusCode,function(err,body){});
		}
	});
});

router.post('/getTransaction',function(req,res){
	var id_member = req.body.id_member;
	var respond;
	console.log("transaction for member: "+id_member);
	var limit = req.body.limit;
	transaction_db.view('transaction','bymember',{keys:[id_member]},function(err,body){
		if(err){
			res.json({"error":true,"message":err});
		}else{
			if(body.length==0){
				respond = {"error":true,"message":"no record found"};
				res.json(respond);
			}else{
				respond = {"error":false,"rows":body};
				res.json(respond);
				couchdb.activityLog(req.username,req.url,respond,res.statusCode,function(err,body){});
			}
		}
	});
	// var sql = "SELECT * FROM transaksi WHERE id_order IN (SELECT id_order FROM member_order WHERE id_member = "+id_member+" ) ORDER BY created_at DESC"
	// connection.query(sql,function(err,rows){
	// 	console.log("GET TRANSACTION QUERY:");
	// 	if(err){
	// 		console.log(err);
	// 		res.json({"error":true,"message":err});
	// 	}else{
	// 		if(rows.length==0){
	// 			err = "No recour found";
	// 			console.log(err);
	// 			res.json({"error":true,"message":err});
	// 		}else{
	// 			res.json(rows);
	// 		}
	// 	}
	// });
});
router.post('/count',function(req,res){
	var id_member = req.body.id_member;
	connection.query("SELECT count(*) as count FROM transaksi WHERE id_order IN (SELECT id_order FROM member_order WHERE id_member = "+id_member,function(err,rows){
		console.log("GET TRANSACTION QUERY:");
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
		}else{
			if(rows.length==0){
				err = "No record found";
				console.log(err);
				res.json({"error":true,"message":err});
			}else{
				res.json(rows);
			}
		}
	});
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
	//var isCheck = req.body.isCheck;
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

function getData(sql,callback){
	connection.query(sql,function(err,rows){
		if(err){
			callback(err);
			console.log(err);
		}else{
			if(rows.length==0){
				err = sql+"empty table";
				callback(err);
				console.log(err);
			}else{
				callback(null,rows);
			}
		}
	});
}

function getSaldo(id_member,callback){
	var sql = "SELECT * FROM member WHERE id_member = ?";
	connection.query(sql,[id_member],function(err,rows){
		if(err){
			console.log(err);
		}else{
			if(rows.length==0) {
				res.json({"status":"error","message":"data tidak ditemukan"});
			}else{
				var saldo = rows[0].total_saldo;//saldo member saat ini
				var komisi = rows[0].total_komisi;
				callback(null,saldo,komisi);
			}
		}
	});
}

function cekProduk(id_produk,id_uplink,qty,callback){
	produk_db.get(id_produk,function(err,rows){
		var status ={};	
		if(err){
			console.log(err);
			return callback(err);
		}else{
			console.log('rows %j:',rows);
			var harga_jual = rows.harga_jual;
			var harga_jual_member = harga_jual[id_uplink];
			console.log("uplink: "+id_uplink);
			var total = harga_jual_member*qty;
			console.log("total: "+harga_jual_member);
			var list_supplier = rows.supplier;
			var tipe = rows.tipe;
			//console.log(tipe);
			var status_aktif = rows.aktif;  
			var status_kosong = rows.kosong;
			var status_transaksi = false;
			if(status_aktif && !status_kosong) status_transaksi = true;
			status = {
				"status_transaksi":status_transaksi,
				"id_produk":id_produk,
				"order_qty":qty,
				"tipe":tipe,
				"harga":harga_jual_member,
				"total":total,
				"status_aktif":status_aktif,
				"status_kosong":status_kosong
			}
			console.log("add transaksi sukses");
			callback(null,status,list_supplier);
		}
	});
}
router.post('/getBill',function(err,req){
	var id_produk = req.body.id_produk;
	var tujuan = req.body.tujuan;
});
function getPostpaidBill(id_produk,nomorPelanggan,callback){
	var transaction_db = nano.db.use('ipay_transaction');
	var produk_tujuan = id_produk.toUpperCase()+'CEK_'+nomorPelanggan;
	var bill = null;
	var id;
	async.series([
		function(callback){
			var doc = {id_produk:id_produk,tujuan:nomorPelanggan,produk_tujuan:produk_tujuan,new_trans:true,biaya:null}
			transaction_db.insert(doc,function(err,body){
				if(err){
					callback(err);
				}else{
					id = body.id;
					console.log(id);
					var rev = body.rev;
					
					callback();
				}
			});
		}
		,
		function(callback){
			sendRequest(id_produk,nomorPelanggan,'cek_tagihan');
			callback();
		}
		,
		function(callback){
			async.whilst(
				function(){
					//console.log('waiting for respond');
					return bill == null;
				}
				,function(callback){
					cekPostpaidRespond(id,function(err,getbill){
						if(err){
							callback(err);
						}else{
							bill = getbill;
							setTimeout(callback,1000);
						}
					});
				}
				,callback);
		}
		,
		function(callback){
			couchdb.updateDb('ipay_transaction',id,{'new_trans':false},function(err,result){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	]
	,function(err){
		if(err){
			callback(err);
		}else{
			callback(null,bill);
		}
	});
}

function cekPostpaidRespond(id,callback){
	var transaction_db = nano.db.use('ipay_transaction');
	console.log('waiting for respond: ',id);
	transaction_db.get(id,function(err,body){
		if(err){
			callback(err);
		}else{
			var bill = body.biaya;
			callback(null,bill);
		}

	});
}
function sendRequest(id_produk,tujuan,mode){
	var format;
	var id = '352879067055724';
	var pin = '4321';
	if(mode=='cek_harga'){
		format = 'harga.'+id_produk;
	}else if(mode=='cek_tagihan'){
		format = id_produk+'cek.'+tujuan;
	}else if(mode=='bayar_tagihan'){
		format = id_produk+'byr.'+tujuan;
	}else{
		format = id_produk+'.'+tujuan;
	}
	var message = format+pin;
	var time = new Date();
	var waktu = time.toJSON();
	waktu = waktu.substring(0,waktu.indexOf('.')).replace('T',' ');
	var waktu_sign = Date.parse(time);
 	var signature = new Buffer(id+' '+waktu_sign).toString('base64');
	request({
	  uri: "https://11.0.0.47/TransaksiJesJes",
	  method: "POST",
	  form: {
	    "id":id,
	    "message":message,
	    "waktu":waktu,
	    "signature":signature
	  }
	}, function(error, response, body) {
	  console.log(body);
	});
}
function cekSaldo(id_member,callback){
	var member_db = nano.db.use('ipay_member');
	member_db.get(id_member,function(err,body){
		if(err){
			callback(err);
		}else{
			var saldo = body.saldo;
			callback(null,saldo);
		}
	});
}

router.post('/sendRespond',function(req,res){
	var respond = req.body;
	console.log(respond);
});

router.post('/transaksi',function(req,res){//UNTUK TRANSAKSI
	console.log("mulai transaksi");
	var produks = req.body.prod;
	var id_member = req.body.id_member;
	var prod_count = produks.length;
	var username = req.body.username;
	var id_uplink = req.body.id_uplink;
	var date = new Date();

	var orderid = createKodeOrder(4);
	var total_biaya=0;
	var total_saldo;
	var status_biaya;
	var saldo_cukup;
	var isSuccess;
	var status_biller = true;
	var status_order;
	
	var prod_stat = [];
	var order = [];

	var orderspeed;
	var cekprodukspeed;
	var catatmysqlspeed;
	var catatcouchspeed;
	var supplierspeed;

	var id_koor;
	var id_korwil;
	var deposit_korwil;

	async.series([
		//Insert order baru pada tabel order 
		function(callback){
			getUplinks(id_member,function(err,koor,korwil){
				if(err){
					callback(err);
				}
				id_koor = koor;
				console.log('id_koor: ',id_koor);
				id_korwil = korwil;
				console.log('id_korwil: ',id_korwil);
				callback();
			});
		}
		,function(callback){
			console.log("Insert order");
			var begin = Date.now();
			connection.query("INSERT INTO member_order(id_order,id_member)VALUES('"+orderid+"',"+id_member+")", function(err,result){
				if(err){
					console.log(err);
					callback(err);
				}else{
					var end = Date.now();
					var speed = end-begin;
					orderspeed = speed;
					callback();
				}
			});
		},function(callback){
			//cek sado member
			cekSaldo(id_member,function(err,saldo){
				if(err){
					callback(err);
				}else{
					total_saldo = saldo;
					console.log("Total Saldo: "+total_saldo);
					callback();
				}
			});
		}
		// ,function(callback){
		// 	//cek deposit korwil
		// 	member_db.get(id_korwil,function(err,result){
		// 		if(err)callback(err);
		// 		if(result.length==0)callback(err);
		// 		deposit_korwil = result.deposit;
		// 		callback();
		// 	});
		// }
		],
		function(err){
			if(err){//Jika create order error
				console.log(err);
				res.json({"error":true,"message":err});
			}else{
				//Catat transaksi untuk setiap produk
				async.each(produks, function(produk, callback){//Transaksi untuk setiap produk
					var id_produk = produk.id_produk;
					console.log("produk: %j",produk);
					var id_tran;
					var rev;
					var qty = produk.qty;
					var total;	
					
					var tujuan = produk.tujuan;
					
					var status_transaksi=false;
					var status=[];
					
					var list_supplier= [];
					var selected_supplier;
					var id_transaksi;
					async.series([
						function(callback){
							console.log("mulai cek produk");
							var begin = Date.now();
							cekProduk(id_produk,id_uplink,qty,function(err,status_tran,suppliers){
								if(err){
									console.log(err);
									callback(err);
								}else{
									status = status_tran;
									total = status['total'];
									status["tujuan"]=tujuan;
									status["produk_tujuan"]=id_produk+'_'+tujuan;
									status["orderid"]=orderid;
									list_supplier = suppliers;
									console.log("postpaid :"+status.tipe);
									if(status.tipe=='postpaid'){
										status["produk_tujuan"]=id_produk+'byr_'+tujuan;
										var postpaidSupplier = Object.keys(list_supplier)[0];
										getPostpaidBill(id_produk,tujuan,function(err,bill){
											if(err){
												console.log(err);
												callback(err);
											}else{
												status['total'] = bill;
												total = bill;
												total_biaya=+total;
												console.log("Totalbiaya="+total_biaya);
												console.log("add transaksi sukses");
												var end = Date.now();
												var speed = end-begin;
												cekprodukspeed = speed;
												callback();
											}
										});
									}else{
										total_biaya=+total;
										console.log("add transaksi sukses");
										var end = Date.now();
										var speed = end-begin;
										cekprodukspeed = speed;
										callback();
									}
								}
								
							});
						},
						function(callback){
							//catat transaksi
							var begin = Date.now();
							var sql = "CALL transaksi_sp('"+orderid+"',"+id_member+","+id_uplink+","+qty+",'"+id_produk+"',"+total_biaya+",'"+tujuan+"','"+username+"')";
							if(total_saldo-total_biaya<0){
								callback("saldo agen tidak cukup, total biaya: "+total_biaya+", total saldo: "+total_saldo);
							}else if(deposit_korwil-total_biaya<0){
								callback("saldo korwil tidak cukup, total biaya: "+total_biaya+", total saldo: "+deposit_korwil);
							}else{
								total_saldo = total_saldo-total_biaya;
								connection.query(sql,function(err,rows){
									if(err){
										callback(err);
									}else{
										console.log("catat transaksi sukses");
										var tran = rows[0];
										console.log("rows: "+tran);
										id_transaksi = tran[0].id_transaksi;
										console.log("id_transaksi: "+id_transaksi);
										status["status_biller"]='diproses';	
										status["id_transaksi"]=id_transaksi;
										id_tran = id_transaksi;
										var end = Date.now();
										var speed = end-begin;
										catatmysqlspeed = speed;
										callback();
									}									
								});
							}							
						}
						,function(callback){
							console.log("Kirim ke biller: "+selected_supplier);
							console.log("+++++++++++++++++++++++TRANSAKSI SUKSES++++++++++++++++++++++++++++")
							callback();
						}
						,function(callback){
							var begin = Date.now();
							console.log("id_transaksi: "+id_transaksi);
							status["supplier"] = list_supplier;
							status['new_trans']=true;
							var doc = status;
							doc["id_member"] = id_member;
							doc["orderid"] = orderid;
							doc["id_koor"]=id_koor;
							doc["id_korwil"]=id_korwil;
							doc["timestamp"]= Date.now();
							transaction_db.insert(doc,""+id_transaksi+"",function(err,body){
								if(err){
									console.log("Error insert pada couchdb transaksi :"+err);
									callback(err);
								}else{
									rev=body.rev;
									status["tran_rev"] = rev;
									prod_stat.push(status);
									
									status["id_agen"] = id_member;
									status["id_koor"]=id_koor;
									status["id_korwil"]=id_korwil;
									order.push(status);
									var end = Date.now();
									var speed = end-begin;
									catatcouchspeed = speed;
									sendRequest(id_produk+'byr',tujuan);
									callback();
								} 
							});
							
						}
						],callback);
					
				}
				,function(err){
					if(err) {
						console.log(err);
						res.json({"error":true,"message":err});
					}
					else{
						if(total_saldo<total_biaya){
							saldo_cukup = false;
						}else{
							saldo_cukup = true;
						}
						status_order = [{
							"id_member":id_member,
							"isSuccess":isSuccess,
							"total_biaya":total_biaya,
							"saldo":total_saldo,
							"saldo_cukup":saldo_cukup,
							"prod_stat":prod_stat
						}];
						couchdb.updateDb('ipay_member',id_member,{"saldo":total_saldo},function(err,body){
							if(err){
								console.log("update couch member error: "+err);
							}else{
								console.log("Create Order speed: "+orderspeed+"ms");
								console.log("cek produk speed: "+cekprodukspeed+"ms");
								console.log("Catat Transaksi speed: "+catatmysqlspeed+"ms");
								console.log("Catat transaksi couchdb speed :"+catatcouchspeed+"ms");
								res.json(status_order);
								//cekRespon();
							}
						});
					}
				});	
	}
	});
});

router.post('/getRespon',function(req,res){
	var id_member = req.body.id_member;
	console.log('cek respon');
	transaction_db.view('transaction','new_res_member',{keys:[id_member]},function(err,body){
		if(err){
			res.json({'error':true,'message':err});
		}else{
			res.json(body);
		}
	});
});


function setResponded(doc_id,callback){
	couchdb.updateDb('ipay_transaction',doc_id,{'new_trans':false},function(err,body){
		if(err){
			callback(err);
		}else{
			console.log(doc_id,'responded');
			callback(null,true);
		}
	});
}

function setFinished(doc_id,callback){
	couchdb.updateDb('ipay_transaction',doc_id,{'new_trans':false,'new_res':false},function(err,body){
		if(err){
			callback(err);
		}else{
			console.log(doc_id,'finished');
			callback(null,true);
		}
	});
}

function setKomisi(id_produk,qty,id_korwil,id_koor,id_tran,callback){
	produk_db.get(id_produk,function(err,rows){
		if(err){
			callback(err);
		}else{
			var harga_jual_koor = rows.harga_jual[id_koor];
			var harga_jual_korwil = rows.harga_jual[id_korwil];
			var harga_beli_koor = rows.harga_beli[id_koor];
			var harga_beli_korwil = rows.harga_beli[id_korwil];
			var komisi_koor = (harga_jual_koor - harga_beli_koor)*qty;
			var komisi_korwil = (harga_jual_korwil - harga_beli_korwil)*qty;
			console.log("Komisi korwil %s : %s",id_korwil, komisi_korwil);
			console.log("Komisi koor %s : %s",id_koor, komisi_koor);
			connection.query("CALL komisi_sp("+id_tran+","+komisi_koor+","+komisi_korwil+","+id_koor+","+id_korwil+")",function(err,result){
				if(err){
					callback(id_tran+err);
				}else{
					setFinished(id_tran,function(err,res){

					});
					callback(null,result);
				}
			});
		}
	});
}

function createRefund(id_transaksi,callback){
	var query = "CALL refund_sp('"+id_transaksi+"')";

	connection.query(query,function(err,rows){
		if(err){
			callback(id_transaksi+err);
		}else{
			setFinished(id_transaksi,function(err,res){

			});
			callback(null,true);
		}
	});
}

router.post('/getSaldo',function(req,res){
	var id_member = req.body.id_member;
	getSaldo(id_member,function(err,saldo,komisi){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else{
			res.json({'saldo':saldo,'komisi':komisi});
		}
	});
});

router.post('/get-catatan-pembayaran',function(req,res){
	var id_member = connection.escape(req.body.id_member);
	console.log(id_member);
	var query = 'SELECT * FROM pembayaran_saldo WHERE id_member ='+id_member;
	console.log(query);
	getData(query,function(err,rows){
		if(err){
			console.log(err);
			res.json({'err':true,'message':err});
		}else{
			res.json(rows); 
		}
	});
});

function selectSupplier(suppliers){
	var lowest = 999999999999999;
	var lowest_key = null;
	for(var key in suppliers ){
		var price = suppliers[key].harga;
		if(lowest>price){
			lowest = price;
			lowest_key = key;
		}
		if(suppliers[key].prioritas)lowest_key = key;
	}
	return key;
}

router.post('/cekTransaksi',function(req,res){
	var id_transaksi = req.body.id_transaksi;
	transaction_db.get(id_tran,function(err,rows){
		if(err){
			console.log("error: "+err);
			res.json({"error":true,"message":err});
		}
		res.json({"error":false,"status":rows.status_biller});
	});
});


function getUplinks(id_member,callback){
	var member_db = nano.db.use('ipay_member');
	member_db.get(id_member,function(err,rows){
		if(err){
			callback(err);
		}else{
			//console.log('member: %j',rows);
			var lv1 = rows.lv1;
			var lv2 = rows.lv2;
			var id_koor = lv2[0].id_koordinator;
			var id_korwil = lv1[0].id_korwil;
			callback(null,id_koor,id_korwil);
		}
	});
	
}

function prosesTransaksi(transaksi){
	var transaction_db = nano.db.use('ipay_transaction');
	var trans = [];
	var stat = {};


	async.each(transaksi,function(tran,callback){
		var id_tran = tran.id_transaksi;
		console.log("processing transaction: "+id_tran);
		var produk = tran.id_produk;
		var qty = tran.order_qty;
		var tujuan = tran.tujuan;
		var rev = tran.tran_rev;
		var rule = new schedule.RecurrenceRule();
		rule.second = 5;

		console.log("callBiller");
		var status = callBiller(tran);
		
		var i = 0;
		while(!status && i<5){
			i++;
			console.log("mencoba menghubungi biller...: "+i+"x, status: "+status);
			status = callBiller(tran);
		}
		if(!status){
			createRefund(id_tran,function(err,status_refund){
				if(err){
					callback(err);
				}else{
					stat[id_tran]=status;
					stat["refund"]=status_refund;
					trans.push(stat);
					console.log(stat); 
					callback();	
				}
			});
		}else{
			stat[id_tran]=status;
			trans.push(stat);
			console.log(stat); 
			setKomisi(produk,qty,id_koor,id_korwil,id_tran,function(err,result){
				console.log("RESULT KOMISI: "+result);
				callback();
			});
		}
		
	},function(err){
		if(err){
			console.log(err);
		}else{
			console.log(trans);	
		}
	});
	
}

function callBiller(transaksi){
	var stat = Math.floor(Math.random()*10)%2;
	var i = 0;
	var supplier = selectSupplier(transaksi.supplier);
	if(stat!=0){
		return false;
	}else{
		couchdb.updateDb('ipay_transaction',transaksi.id_transaksi,{'status_biller':true},function(err,body){
			if(err){
				console.log("update ipay_transaction error");
				return true;
			}else{
				
			}
		});
		return true;
	}
	//return true;
}


function updateStatusBiller(transaksi){
	var id_transaksi = transaksi.id_transaksi;
	var supplier = transaksi.supplier;
	var produk = transaksi.id_produk;
	var qty = transaksi.order_qty;
	var tujuan = transaksi.tujuan;
	var rev = transaksi.tran_rev;
	var harga_awal = transaksi.harga;
	var transaction_db = nano.db.use('ipay_transaction');
	var harga = Math.floor(Math.random()*100000);
	var total = harga_awal*qty;
	var id_uplink = transaksi.id_uplink;
	transaction_db.insert({_id:""+id_transaksi+"" ,_rev:rev,status_biller:true,harga_beli:harga,id_uplink:id_uplink,harga:harga_awal,supplier:supplier,tujuan:tujuan,id_produk:produk},""+id_transaksi+"",function(err,body){
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
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
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

// router.post('/cekHarga',function(req,res,next){
// 	var product_id = req.body.product_id;
// 	var harga_jual;
// 	var uplink = req.body.uplink;
// 	async.series([
// 		function(callback){
// 			var sql = 'SELECT product_id,harga_jual FROM produk_member WHERE member_id="'+uplink+'" AND product_id="'+product_id+'"';
// 			connection.query(sql,[uplink],function(err,field){
// 				if (err){
// 					console.log(err);
// 				}else{
// 					res.json(field);
// 					console.log(field);
//     				//res.send(field);
//     			}
//     		});
// 		}
// 		])
// });

module.exports = router;