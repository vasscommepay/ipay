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



router.get('/exportUser',function(req,res){
	
});
router.get('/getMember',function(req,res){
	
});
router.get('/exportMember',function(req,res){
	
});

router.get('/exportForm',function(req,res){
	
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