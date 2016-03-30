var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');
var nano   = require('nano')('http://localhost:5984');

router.get('/exportProduk',function(req,res) {
	var ipay = nano.db.use('ipay');
	var produks;
	async.series([
		function(callback){
			connection.query("SELECT * FROM master_produk",function(err,rows){
				if(err){
					console.log(err);
				}else{
					if(rows.length==0){
						console.log("nodata");
					}else{
						produks = rows;
						callback();
					}
				}
			});
		}
		],function(err){
			if(err) console.log(err);
			var bod = [];
			async.each(produks,function(produk,callback){
				var id_produk = connection.escape(produk.id);
				var nama = produk.nama;
				var harga = produk.harga_beli;
				var nominal = produk.nominal;
				
				var aktif = true;
				if(produk.aktif!=1) aktif = false;
				var kosong = false;
				if(produk.kosong!=0) kosong = true;
				var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ="+id_produk;
				connection.query(sql,function(err,rows){
					if(err){
						console.log(err);
					}else{
						if(rows.length==0){
						console.log("nodata");
						}else{
							var harga_beli='"'+rows[0].member_id+'":'+rows[0].harga_beli;
							var harga_jual='"'+rows[0].member_id+'":'+rows[0].harga_jual;
							var len = rows.length;
							var i;
							for(i = 1;i<len;i++){
								harga_beli = harga_beli +','+ rows[i].member_id+':'+rows[i].harga_beli;
								harga_jual = harga_jual+','+ rows[i].member_id+':'+rows[i].harga_jual;
							}
							var newRow = '{id:'+id_produk+',nama:"'+nama+'",harga:'+harga+',nominal:'+nominal+',aktif:'+aktif+',kosong:'+kosong+',harga_beli:{'+harga_beli+'},harga_jual:{'+harga_jual+'}}';
							var row = {nama:nama,harga:harga,nominal:nominal,aktif:aktif,kosong:kosong,harga_beli:"{"+harga_beli+"}",harga_jual:"{"+harga_jual+"}"};
							console.log(newRow);
							ipay.insert(row,id_produk,function(err,body){
								if(err) console.log(err);
								bod.push(body);
								callback();
							});

						}
					}
				});
			},function(err){
				if(err) console.log(err);
				res.json(bod);
			});
		});

});
module.exports = router;