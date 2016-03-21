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

router.post('/getProduct',function(req,res){
	var idAtasan;
	var sqlAtasan;
	var sqlProduk;
	var id_member = req.body.id_member;
	var level = req.body.level;
        	if(level==2){
        		sqlAtasan = "SELECT id_korwil as atasan FROM member_koordinator WHERE id_member ="+id_member;
        	}else if(level==3){
        		sqlAtasan = "SELECT id_koordinator as atasan FROM member_agen WHERE id_member ="+id_member;
        	}else{
        		sqlAtasan = "SELECT id_member as atasan FROM member_internal";
        	}
    if(req.body.kategori!=null){
    	sqlProduk = "SELECT * FROM produk_member JOIN master_produk ON product_id = id WHERE member_id= ? AND kategori_produk="+req.body.kategori;
    }else{
    	sqlProduk = "SELECT * FROM produk_member WHERE member_id=?";
    }
	
	connection.query(sqlAtasan,function(err,rows){
		if (err){
		   console.log(err);
		   res.json({"inserted" : false,"message":err});
		}else{
			if(rows[0]==null){
				console.log("KOPLAK");
			}else{
				id_atasan= rows[0].atasan;
				console.log(id_atasan);
				connection.query(sqlProduk,[id_atasan],function(err,rows){
					if(err){
						console.log(err);  
			   			res.json({"select" : false,"message":err});
					}else{
						res.json(rows);				
					}
				});
			}
			
		}
	});
});


module.exports = async;
module.exports = router;