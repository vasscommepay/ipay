var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');
var nano   = require('./nano');
var app = express();
var couchdb = require('./couchdbfunction');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/respon-biller',function(req,res){
	var respond = req;
	console.log(respond);
	res.send(respond);
});

router.post('/exportPostpaid',function(req,res){
	var postpaid_db = nano.db.use('ipay_postpaid');
	var supplier = req.body.sup;
	var nomorPelanggan = req.body.tujuan;
	postpaid_db.insert({supplier:supplier,tujuan:nomorPelanggan,new_req:true},function(err,body){
		if(err){
			console.log(err);
			//callback(err);
		}else{
			console.log(body);
			res.json(body);
			//callback(null,body);
		}
	});
});

router.get('/exportUser',function(req,res){
	couchdb.exportUser(function(err,result){
		if(err){
			console.log(req.url, "error: "+err);
			res.json({"error":true,"message":err});
		}else{
			res.json(result);
		}
	});
});
router.get('/getMember',function(req,res){
	
});
router.get('/exportMember',function(req,res){
	couchdb.exportMember(function(err,result){
		if(err){
			res.json({'error':true,'message':err});
		}else{
			res.json(result);
		}
	});
});

router.get('/exportForm',function(req,res){
	couchdb.exportForm(function(err,result){
		if(err){
			res.json({'error':true,'message':err});
		}else{
			res.json(result);
		}
	});
});

router.get('/updateForm',function(req,res){	
});

router.get('/exportProduk',function(req,res) {
	couchdb.exportProduk(function(err,body){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else{
			console.log("All product exported");
			res.json({'error':false,'body':body});
		}
	});
});

router.get('/updateProduk',function(req,res){
	couchdb.updateProduk(function(err,body){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else{
			console.log("All product updated");
			res.json({'error':false,'body':body});
		}
	})
});
router.get('/exportSupplier',function(req,res){	
	
});
router.post('/getProduk',function(req,res){	
});
module.exports = router;