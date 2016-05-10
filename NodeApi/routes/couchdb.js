var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var async      = require('async');
var nano   = require('./nano');
var nodemailer = require('nodemailer');
var app = express();
var request 	= require("request");
var couchdb = require('./couchdbfunction');
var moment = require('moment-timezone');
moment().tz("Asia/Jakarta").format();

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
router.post('/sendRequest',function(req,res){
	var id_produk = req.body.produk;
	var tujuan = req.body.tujuan;
	var mode = req.body.mode;
	sendRequest(id_produk,tujuan,mode,function(err,response,body){
		if(err){
			res.json({'error':err});
		}else{
			res.json({'response':response,'body':body});
		}
	});
	//res.json({'response':id_produk,'body':tujuan});
});
function sendRequest(id_produk,tujuan,mode,callback){
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
	var waktu = time.toISOString();
	waktu = waktu.substring(0,waktu.indexOf('.')).replace('T',' ');
	var waktu_sign = Date.parse(waktu)/1000;
 	var signature = new Buffer(id+' '+waktu_sign).toString('base64');
 	console.log(signature);
 	var body=({waktu:waktu,waktu_sign:waktu_sign,signature:signature});
 	//callback(null,null,body);
	request({
	  uri: "https://10.0.0.6/TransaksiJesJes",
	  method: "POST",
	  "rejectUnauthorized": false,
	  form: {
	    "id":id,
	    "message":message,
	    "waktu":waktu,
	    "signature":signature
	  }
	}, function(error, response, body) {
	  if(error){
	  	callback(error)
	  }else{
	  	callback(null,response,body);
	  	console.log(response,body);
	  	request.end();
	  }
	});
}

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

	var message = '<body>    <div class="container">		<div class="page">			<div class="mail-title">				<h2>Selamat Anda Telah Terdaftar Pada iPay</h2>			</div>			<div class="mail-body">				Selamat, anda telah terdaftar sebagai"+role+"ipay<br>				Berikut adalah informasi terkait dengan akun anda:<br>				<ul>					<li>Nama: Bagus Fibrianto</li>					<li>Role: Bos</li>					<li>Nomor Registrasi: sempal</li><b></b>				</ul>				<p>Gunakan nomor registrasi untuk membuat akun baru pada iPay.</p>			</div>		</div>		<div class="mail-footer">    		<div class="footer-element" align="center">    			iPay    		</div>    		<div class="footer-element" align="center">    			Layanan pembayaran    		</div>    		<div class="footer-element" align="center">    			Mantab    		</div>';
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