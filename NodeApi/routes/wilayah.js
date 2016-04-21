var express    	= require('express');
var router     	= express.Router();
var bodyParser 	= require('body-parser');
var connection 	= require('./db');
var nano   		= require('./nano');
var async      	= require('async');
var app 		= express();
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

router.post("/getWilayah",function(req, res, next) {
var getWilayah = 'SELECT * from wilayah where id="'+req.body.id_wilayah+'"';
	connection.query(getWilayah, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(fields);
		}
	});
});

router.post("/addWilayah",function(req, res, next) {
var id_wilayah 		= req.body.id_wilayah;
var nama_wilayah 	= req.body.nama_wilayah; 
var addWilayah = 'INSERT INTO wilayah (id,nama) values ("'+id_wilayah+'","'+nama_wilayah+'")';
	connection.query(addWilayah, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json({"status" : "Inserted"});
		}
	});
});

router.put("/updateWilayah",function(req, res, next) {
var addWilayah = 'UPDATE wilayah SET nama="'+req.body.nama_wilayah+'" where (id="'+req.body.id_wilayah+'")';
	connection.query(addWilayah, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json({"status" : "Updated"});
		}
	});
});

router.delete("/delWilayah",function(req,res,next) {
	var delWilayah = 'delete from wilayah where id="'+req.body.id_wilayah+'"';
	connection.query(delWilayah, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Deleted: ' + JSON.stringify(rows));
			res.json({"status" : "deleted"});
		}
	});
				
});

module.exports = router;