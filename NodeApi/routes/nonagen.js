var express    		= require('express');
var async      		= require('async');
var router     		= express.Router();
var bodyParser 		= require('body-parser');
var randomstring 	= require('randomstring');
var connection 		= require('./db');
var nano   			= require('./nano');
var transaction   	= require('./transaction');
var app 			= express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var supplier_db 	= nano.db.use('ipay_supplier');
var transaction_db 	= nano.db.use('ipay_transaction');

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
					//rev=body.rev;
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
			//prosesTransaksi(prod_stat);
			prod_stat = [];
	});			
});

router.post('/cekTransaksi',function(req,res){
	var id_transaksi = req.body.id_transaksi;
	transaction_db.get(id_transaksi,function(err,rows){
		res.json({"status":rows});
	})
});

module.exports = async;
module.exports = router;