var express = require('express');
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
var sessionStat = false;

router.post("/addProduk",function(req,res,next) {

	var id = connection.escape(req.body.idproduk);
	var nama = connection.escape(req.body.namaproduk);
	var harga_beli = connection.escape(req.body.harga_beli);
	var keterangan = connection.escape(req.body.keterangan);
	var kategori_produk = connection.escape(req.body.kategori_produk);
	var nominal = connection.escape(req.body.nominal);
	var prabayar = connection.escape(req.body.prabayar);
	var sql = 'INSERT INTO master_produk(id,nama,harga_beli,keterangan,kategori_produk,nominal,prabayar) VALUES("'+id+'","'+nama+'",'+harga_beli+',"'+keterangan+'","'+kategori_produk+'","'+nominal+'","'+prabayar+'")';

	var session = req.body.session;

	console.log(sessionStat);
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result', function(err, rows, fields) {
			if (err){
			   console.log(err);
			}else{
				if(rows[0].result===1){
					connection.query(sql, function(err, rows, fields) {
						if (err){
						   console.log(err);
						   res.send(err);
						}else{
							res.json(
								{"status":"inserted"});
						}
					});
				}else{
					res.json({"status":"session tidak terdaftar"});
				}
			}
		});
		
	}else{
		res.json({"status":"tidak ada session"});
	}
});




module.exports = router;