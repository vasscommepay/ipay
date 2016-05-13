var express    	= require('express');
var async      	= require('async');
var router     	= express.Router();
var bodyParser 	= require('body-parser');
var connection 	= require('./db');
var nano   		= require('./nano');
var app 		= express();
var couchdb 	= require('./couchdbfunction');
var transaction = require('./transaction');
var schedule 	= require('node-schedule');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var supplier_db = nano.db.use('ipay_supplier');
var transaction_db = nano.db.use('ipay_transaction');
var produk_db = nano.db.use('ipay_produk');	
var member_db = nano.db.use('ipay_member');

router.post('/getIdBank',function(req,res){
	var id_bank = req.body.id_bank;
	var getIdBank ='SELECT * from bank where id_bank="'+req.body.id_bank+'"';
    	connection.query(getIdBank,function(err,rows){
    		if (err){
			   console.log(err);
			}else{
				if (rows[0]==null){
					res.json({"Status" : false , "Message" : "Bank Not Exist"});
					console.log('Message : Bank Belum Terdaftar');
				} else {
					res.json({"Status" : true , "Message" : "Bank Is Exist"});
					console.log('Message : Bank Terdaftar');
				}
			}
    	});
});

router.post('/test',function(req,res,next){
	var output = new Object;
	async.series([
		function(callback){
			var tujuan = req.body.tujuan;
			//var no_hp = tujuan.substr(8,13);
			var kode_order = randomstring.generate({
				  length: 8,
				  charset: 'numeric'
			});
			//output.kode_unik = kode_order+'-'+no_hp;
			output.kode_unik = kode_order;
			output.tujuan = req.body.tujuan;
			res.json(output);
		}
	])
});

router.post('/langsung',function(req,res,next){
	var output = new Object;
	var id_produk;
	var id_member_produk;
	var quantities 			= req.body.quantities;
	var tujuan 				= req.body.tujuan;
	var id_order_request;

	async.series([
		function(callback){
			var rekening_tujuan		= req.body.rekening_tujuan;
			var bank_tujuan			= req.body.bank_tujuan;
			//var no_hp 			= tujuan.substr(8,13);
			var kode_order 			= randomstring.generate({
					length: 8,
				  	charset: 'numeric'
			});
			//output.kode_unik = kode_order+'-'+no_hp;
			output.kode_unik 		= kode_order;
			output.tujuan 			= tujuan;
			//res.json(output);
			var quantities 			= req.body.quantities;
			var id_order_request 	= kode_order;
        	var non_member 			= 'INSERT INTO transaksi_non_member(id_order_request,quantities,tujuan,bank_tujuan,rekening_tujuan) VALUES ("'+id_order_request+'","'+quantities+'","'+output.tujuan+'","'+bank_tujuan+'","'+rekening_tujuan+'")';
        	connection.query(non_member, function(err, result) {
				if (err){
					//console.log(err);
					//res.send({"Inserted" : false , "Message" : "Order Gagal"});
					console.log('Message : Order Gagal');
				}else{
					//res.send({"Inserted" : true , "Message" : "Order Berhasil"});
					console.log('Message : Order Berhasil');
					callback();
				}
			});
        },
        function (callback){
        	var rev;
        	var id_order 	= output.kode_unik;
        	var harga 		= req.body.harga;
        	var id_produk 	= req.body.id_produk;
        	var supplier 	= req.body.supplier;
			var transaction_db 	= nano.db.use('ipay_transaction');
			//var harga = Math.random()*100000;
			var id_transaksi 	= output.kode_unik;
			transaction_db.insert({_id:""+id_transaksi+"" ,_rev:rev,status_biller:true,harga:harga,id_produk:id_produk,supplier:supplier,tujuan:tujuan},""+id_transaksi+"",function(err,body){
				if(err) console.log(err);
				console.log("transaksi biller sukses pada: "+Date.now());
				callback();
			});
		}
	],
        function (callback){
			var quantities 		= req.body.quantities;
			var id_order 		= output.kode_unik;
        	var rekening_tujuan	= req.body.rekening_tujuan;
			var bank_tujuan		= req.body.bank_tujuan;
        	var bank_asal		= req.body.bank_asal;
			var rekening_asal	= req.body.rekening_asal;
			var nama_asal		= req.body.nama_asal;
        	var konfirmasi 		= {sql : 'INSERT INTO konfirmasi (id_order,bank_tujuan,rekening_tujuan,bank_asal,rekening_asal,nama_asal) VALUES ("'+id_order+'","'+bank_tujuan+'","'+rekening_tujuan+'","'+bank_asal+'","'+rekening_asal+'","'+nama_asal+'")'};
        	connection.query(konfirmasi, function(err, result) {
				if (err){
					console.log(err);
					res.json({"Inserted" : false , "Message" : err});
					console.log('Message : Pembayaran Gagal');
				}else{
					res.json({"Inserted" : true , "Message" : "Success"});
					console.log('Message : Pembayaran Berhasil');
				}
			});
        });
});

router.post('/cekHarga',function(req,res,next){
	var product_id = req.body.product_id;
	var harga_jual;
	var uplink = req.body.uplink;
	async.series([
		function(callback){
        	var sql = 'SELECT product_id,harga_jual FROM produk_member WHERE member_id="'+uplink+'" AND product_id="'+product_id+'"';
        	connection.query(sql,[uplink],function(err,field){
        		if (err){
				   console.log(err);
				}else{
    				res.json(field);
    				console.log(field);
    				//res.send(field);
				}
        	});
        }
	])
});

router.post('/getTransaction',function(req,res){
	var id_member = req.body.id_member;
	console.log("transaction for member: "+id_member);
	var limit = req.body.limit;
	transaction_db.view('transaction','bymember',{keys:[id_member]},function(err,body){
		if(err){
			res.json({"error":true,"message":err});
		}else{
			if(body.length==0){
				res.json({"error":true,"message":"no record found"});
			}else{
				res.json({"error":false,"rows":body});
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
	var id_uplink = req.body.id_uplink;
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
			
			},callback());
			
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
	var sql = "SELECT total_saldo FROM member WHERE id_member = ?";
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

function cekProduk(id_produk,id_uplink,qty,callback){
	produk_db.get(id_produk,function(err,rows){
	    var status ={};	
		if(err){
			console.log(err);
			return callback(err);
		}else{
			var harga_jual = rows.harga_jual;
			var harga_jual_member = harga_jual[id_uplink];
			console.log("uplink: "+id_uplink);
			var total = harga_jual_member*qty;
			console.log("total: "+harga_jual_member);
			var list_supplier = rows.supplier;
			var postpaid = rows.postpaid;
			var status_aktif = rows.aktif;  
			var status_kosong = rows.kosong;
			var status_transaksi = false;
			if(status_aktif && !status_kosong) status_transaksi = true;
			status = {
					"status_transaksi":status_transaksi,
					"id_produk":id_produk,
					"order_qty":qty,
					"postpaid":postpaid,
					"harga":harga_jual_member,
					"total":total,
					"status_aktif":status_aktif,
					"status_kosong":status_kosong
				}
			console.log("add transaksi sukses");
			//callback(null,status,total,status_transaksi,list_supplier);
		}
	});
}

function getPostpaidBill(supplier,nomorPelanggan,callback){
	var bill = Math.floor(Math.random()*100000);
	callback(null,bill);
}

router.post('/transaksi',function(req,res){//UNTUK TRANSAKSI
	console.log("mulai transaksi");
	var produks = req.body.prod;
	var id_member = req.body.id_member;
	var prod_count = produks.length;
	var index;
	//var username = req.body.username;
	var date = new Date();
	var orderid = "od"+date.getTime();
	var total_biaya=0;
	var total_saldo;
	var status_biaya;
	var saldo_cukup;
	var isSuccess;
	var status_biller = true;
	var harga_biller;
	var status_order;
	//var isCheck = req.body.isCheck;
	var prod_stat = [];
	var id_uplink = req.body.id_uplink;
	var list_transaksi=[];
	var orderspeed;
	var cekprodukspeed;
	var catatmysqlspeed;
	var catatcouchspeed;
	var supplierspeed;

	async.series([
		//Insert order baru pada tabel order 
		function(callback){
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
		],
		function(err){
			if(err){//Jika create order error
				console.log(err);
				res.json({"error":true,"message":err});
			}else{
				//Catat transaksi untuk setiap produk
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
							console.log("mulai cek produk");
							var begin = Date.now();
							cekProduk(id_produk,id_uplink,qty,function(err,status_tran,total,status_success,suppliers){
								if(err){
									console.log(err);
									callback(err);
								}else{
									status = status_tran;
									list_supplier = suppliers;
									console.log("postpaid :"+status["postpaid"]);
									if(status.postpaid){
										var postpaidSupplier = list_supplier["1"];
										getPostpaidBill(postpaidSupplier,tujuan,function(err,bill){
											if(err){
												console.log(err);
												callback(err);
											}else{
												status['total'] = bill;
												total = bill;
												total_biaya=+total;
												isSuccess = status_transaksi;
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
										isSuccess = status_transaksi;
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
							var sql = "CALL transaksi_sp('"+orderid+"',"+id_member+","+id_uplink+","+qty+",'"+id_produk+"',"+total_biaya+",'"+tujuan+"')";
							if(total_saldo-total_biaya<0){
								callback("saldo tidak cukup, total biaya: "+total_biaya+", total saldo: "+total_saldo);
							}else{
								total_saldo = total_saldo-total_biaya;
								connection.query(sql,function(err,rows){
								if(err){
									console.log("insert transaksi error, "+err);
									err = "saldo_kurang";
									callback(err);
								}else{
									console.log("catat transaksi sukses");
										var tran = rows[0];
										console.log("rows: "+tran);
										id_transaksi = tran[0].id_transaksi;
										console.log("id_transaksi: "+id_transaksi);
										status["status_biller"]=false;	
										status["id_transaksi"]=id_transaksi;
										id_tran = id_transaksi;
										var end = Date.now();
										var speed = end-begin;
										catatmysqlspeed = speed;
										callback();
									}									
								});
							}							
						},
						function(callback){
							//Pilih supplier
							var begin = Date.now();
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
										console.log("Error pada get proudk couchdb :"+err);
										callback(err);
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
										var end = Date.now();
										var speed = end-begin;
										supplierspeed = speed;
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
							var begin = Date.now();
							console.log("id_transaksi: "+id_transaksi);
							var doc = status;
							doc["id_member"] = id_member;
							doc["orderid"] = orderid;
							doc["timestamp"]= Date.now();
							transaction_db.insert(doc,""+id_transaksi+"",function(err,body){
								if(err){
									console.log("Error insert pada couchdb transaksi :"+err);
									callback(err);
								}else{
									rev=body.rev;
									status["tran_rev"] = rev;
									prod_stat.push(status);
									var transaksi={};
									transaksi["id"]=id_transaksi;
									transaksi["rev"]=rev;
									list_transaksi.push(transaksi);
									var end = Date.now();
									var speed = end-begin;
									catatcouchspeed = speed;
									callback();
								} 
							});
							
						}
					],callback());
					
				},
				function(err){
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
									console.log("Get supplier speed :"+supplierspeed+"ms");
									console.log("Catat transaksi couchdb speed :"+catatcouchspeed+"ms");
									res.json(status_order);
									prosesTransaksi(prod_stat,id_member);
								}
							});
						}
				});	
			}
		});
});

function cekSaldo(id_member,callback){
	member_db.get(id_member,function(err,body){
		if(err){
			callback(err);
		}else{
			if(body.length==0){
				err = "No record found";
				callback(err);
			}else{
				var saldo = body.saldo;
				callback(null,saldo);
			}
		}
	});
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

function tambahKomisi(id_transaksi,id_member,callback){
	var query = "CALL member";
}

function prosesTransaksi(transaksi,id_agen){
	var transaction_db = nano.db.use('ipay_transaction');
	var member_db = nano.db.use('ipay_member');

	var trans = [];
	var stat = {};
	member_db.get(id_agen,function(err,rows){
		if(err){
			console.log(err);
		}else{
			var lv1 = rows.lv1;
			var lv2 = rows.lv2;
			var id_koor = lv1[0].id_koordinator;
			console.log("koor: "+id_koor);
			var id_korwil = lv2[0].id_korwil;
			console.log("korwil: "+id_korwil);
			async.each(transaksi,function(tran,callback){
				var id_tran = tran.id_transaksi;
				console.log("processing transaction: "+id_tran);
				var supplier = tran.supplier;
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
		
	});
}

function createRefund(id_transaksi,callback){
	var query = "CALL refund_sp('"+id_transaksi+"')";
	connection.query(query,function(err,rows){
		if(err){
			callback(err);
		}else{
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
			connection.query("CALL komisi_sp("+id_tran+","+komisi_koor+","+komisi_korwil+","+id_koor+","+id_korwil+")",function(err,result){
				if(err){
					callback(err);
				}else{
					callback(null,result);
				}
			});
		}
	});
}
function callBiller(transaksi){
	var stat = Math.floor(Math.random()*10)%2;
	var i = 0;
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


function log(supplier){
	console.log("transaksi dengan biller: "+supplier+", sukses dilakukan");
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

/*function createKodeOrder(length){
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
}*/

router.post('/getKategori',function(req,res){
	var uplink = req.body.uplink;
	console.log(uplink);
	var sql = "SELECT * FROM kategori_produk WHERE kategori_produk.id_super_kategori IS null";
	connection.query(sql,[uplink],function(err,rows){
		if(err){
			console.log(err);
			res.json({"available":false,"message":err});
		}else{
			res.json(rows);
		}
	});
});	

router.post('/getSubKategori',function(req,res){
	console.log(req.body);
	var uplink = req.body.uplink;
	var super_kategori = req.body.id_kategori;
	var sql = "SELECT * FROM kategori_produk WHERE kategori_produk.id_super_kategori =?";
	console.log(sql);
	connection.query(sql,[super_kategori],function(err,rows){
		if(err){
			res.json({"available":false,"message":err});
		}else{
			console.log(rows);
			if(rows==null){
				res.json({"available":false,"message":"produk kosong"});
			}else{
				res.json(rows);
			}
		}
	});
});	

router.post("/addKategori",function(req,res){
	var id = connection.escape(req.body.id_kategori);
	var nama = connection.escape(req.body.nama_kategori);
	var sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori) VALUES('+id+','+nama +')';
	if(req.body.super_kategori!=null){
		var superkat = connection.escape(req.body.super_kategori);
		sql = 'INSERT INTO kategori_produk(id_kategori,nama_kategori,id_super_kategori) VALUES('+id+','+nama+','+superkat+')';
	}
	console.log(sql);
	connection.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.json({"error":true,"message":err});
		}else{
			res.json({"error":false,"affectedRidows":result.affectedRows});
		}
	});
});

router.post("/updateKategori",function(req,res) {
	var id = connection.escape(req.body.id_kategori);
	var nama = connection.escape(req.body.nama_kategori);
	var superkat = connection.escape(req.body.super_kategori);
	var sql = 'UPDATE kategori_produk SET nama_kategori = '+nama+',id_super_kategori = '+superkat+' WHERE id_kategori = '+id;
	var session = req.body.session;
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"error":true,"message":err});
		}else{
			res.json({"error":false,"affectedRidows":rows.affectedRows});
		}
	});

});

router.post('/delKategori',function(req,res){
	var id = req.body.id_kategori;
	async.series([
		function(callback){
			var idKategori = connection.escape(id);
			var query = 'DELETE FROM kategori_produk WHERE id_kategori='+idKategori;
			connection.query(query,function(err,result){
				if(err){
					console.log(err);
					res.json({"error":true,"message":err});
				}else{
					res.json({"error":false,"affectedRidows":result.affectedRows});
				}
			});
		}	
	])
});

module.exports = async;
module.exports = router;