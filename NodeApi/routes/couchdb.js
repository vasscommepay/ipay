var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');
var nano   = require('./nano');
var nodemailer = require('nodemailer');
var app = express();
var couchdb = require('./couchdbfunction');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/getPetik',function(req,res){
	var trans_db = nano.db.use('ipay_transaction');
	var produk_tujuan = 'ai100_085789111888';
	trans_db.view('transaction','newtrans_byproduk_tujuan',{keys:[produk_tujuan]},function(err,body){
		if(err){
			callback(err);
		}else if(body.total_rows==0){
			callback('no record found');
		}else{
			console.log('%j',body.rows[0]);
			res.json(body.rows[0].id);
		}
	});
});
router.get('/',function(req,res){
	console.log(req.method, req.url);
	sendEmail('bfibrianto@gmail.com','coba aja','coba aja gan',function(err,info){
		if(err){
			res.send(err);
		}else{
			res.send(info);
		}
	});
});

function sendEmail(to,subject,message,callback){
	var transporter = nodemailer.createTransport({
        host: '192.168.13.20',
	    port: '587',
	    secure:false,
	    requereTLS:true, // use SSL
	    tls: {
	        rejectUnauthorized: false
	    },
	    auth: {
	        user: 'regsender@ipay.id',
	        pass: 'TLqd894D6a'
	    }
    });

	var mailOptions = {
	    from: 'regsender@ipay.id', // sender address
	    to: to, // list of receivers
	    subject: subject, // Subject line
	    //text: text //, // plaintext body
	    html: message // You can choose to send an HTML body instead
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        callback(error);
	    }else{
	        console.log('Message sent: ' + info.response);
	        callback(null,info);
	    };
	});
}

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
router.post('/newNotif',function(req,res){
	couchdb.getNotif('new',1,function(err,body){
		if(!err){
			res.json(body);
		}
	});
})

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