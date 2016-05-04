var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var connection = require('./db');
var crypto     = require('crypto');
var async      = require('async');
var nano   = require('./nano');
var app = express();
var couchdb = require('./couchdbfunction');
var getRawBody = require('raw-body');
var typer = require('media-typer');

router.use(function(req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '10mb',
    encoding: typer.parse(req.headers['content-type']).parameters.charset
  }, function (err, string) {
    if (err){ 
    	console.log(err);
    	return next(err);
    }
    req.text = string;
	console.log(string);
    next();
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());


//app.use(bodyParser());

router.post('/',function (req,res,next) {
	var respond = req.text.toLowerCase();
	var doc;
	var status;
	if(respond.includes('SUKSES') || respond.includes('sukses')){
		doc = tranSukses(respond);
		status = 'sukses';
	}else if(respond.includes('GAGAL') || respond.includes('gagal')){
		doc = tranGagal(respond);
		status = 'gagal';
	}else{
		doc = readRes();
		status = 'status';
	}
	console.log('%j',doc);
	//res.send(doc);
	updateTrans(doc,status,function(err,body){
		if(err){
			console.log(err);
			res.send(err);
		}else{
			res.send('Respon telah diterima');
		}
	});
	
});

function updateTrans(doc,status,callback){
	var trans_db = nano.db.use('ipay_transaction');
	var id;
	var produk_tujuan = doc.produk_tujuan;
	console.log(produk_tujuan);
	var biaya = doc.biaya;
	async.series([
		function(callback){
			trans_db.view('transaction','newtrans_byproduk_tujuan',{keys:[produk_tujuan]},function(err,body){
				if(err){
					callback(err);
				}else if(body.total_rows==0){
					callback('no record found');
				}else{
					//id = body.rows;
					console.log(produk_tujuan);
					//console.log('%j',body.rows[0]);
					id = body.rows[0].id;
					callback();
				}
			});
		}
		,
		function(callback){
			couchdb.updateDb('ipay_transaction',id,{'status_biller':status,'biaya':biaya,'reff':doc.ref},function(err,body){
				if(err){
					callback(err);
				}else{
					callback();
				}
			});
		}
	]
	,function(err){
		if(err){
			callback(err);
		}else{
			callback(null,err);
		}
	});
	
}

function tranSukses(message){
	var str = message;
    var eid = str.indexOf(' ');
	var bid = str.search('#');
	var id = str.substr(bid+1,eid-1);
	var bprod = eid+11;
	var eprod = str.indexOf(" (");
	var prod = str.substring(bprod,eprod);
	var bbia = str.indexOf("(");
	var ebia = str.indexOf('ke');
	var bia = str.substring(bbia+3,ebia-2);
	var biaya = bia.replace('.','');
	var btuj = ebia+3;
	var etuj = str.indexOf(' sukses');
	var tuj = str.substring(btuj,etuj);
	var bsn = str.indexOf('.',etuj);
	var esn = str.indexOf('. saldo');
	var ref = str.substring(bsn+1,esn);
	var bsal = str.indexOf('rp ');
	var esal = str.indexOf('@');
	var sal = str.substring(bsal+3,esal);
	var saldo = sal.replace('.','');
	var btime = str.indexOf('@');
	var etime = str.indexOf('r##');
	var time = str.substring(btime+1,etime);
	var doc = {};
	var idku = '352879067055724';
	var time = new Date();
	var waktu = time.toJSON();
	var waktu_sign = Date.parse(time);
	 waktu = waktu.substring(0,waktu.indexOf('.')).replace('T',' ');
	 var signature = new Buffer(idku+' '+waktu_sign).toString('base64');
	 ref = readRef(ref);
	doc['sign']=signature;
	doc['id_tran']=id;
	doc['produk_tujuan']=prod+'_'+tuj;
	doc['id_produk']=prod;
	doc['biaya']=bia.replace('.','');
	doc['tujuan']=tuj;
	doc['ref']=ref;
	doc['saldo']=sal;
	doc['time']=time;
	return doc;
}
function tranGagal(message){
	var message = message.toLowerCase();
	var status;
	var produk_tujuan;
	if(message.includes('kosong')){
		status = 'stok kosong';
		var btuj = message.indexOf('.');
		var etuj = message.indexOf(' ',btuj);
		var sliced = message.substring(0,etuj);
		var bprod = sliced.lastIndexOf(' ');
		var produk = message.substring(bprod,btuj);
		var tujuan = message.substring(btuj+1,etuj);
		produk_tujuan = produk+'_'+tujuan;
	}else if(message.includes('tujuan salah')){
		status = 'nomor tujuan salah';
		var eprotuj = message.indexOf(' ');
		var protuj = message.substring(0,eprotuj);
		produk_tujuan = protuj.replace('.','_');
	}else if(message.includes('saldo tidak cukup')){
		status = 'saldo kurang';
		var eprotuj = message.indexOf(' ');
		var protuj = message.substring(0,eprotuj);
		produk_tujuan = protuj.replace('.','_');
	}else if(message.includes('outer')){
		status = 'nomor tujuan di luar wilayah';
		var eprotuj = message.indexOf(' ');
		var protuj = message.substring(0,eprotuj);
		produk_tujuan = protuj.replace('.','_');
	}else if(message.includes('dibatalkan')){
		status = 'request dibatalkan';
		var eprotuj = message.indexOf(' ');
		var protuj = message.substring(0,eprotuj);
		produk_tujuan = protuj.replace('.','_');
	}else if(message.includes('gangguan')){
		status = 'produk sedang gangguan';
		var btuj = message.indexOf('.');
		var etuj = message.indexOf(' ',btuj);
		var sliced = message.substring(0,etuj);
		var bprod = sliced.lastIndexOf(' ');
		var produk = message.substring(bprod,btuj);
		var tujuan = message.substring(btuj+1,etuj);
		produk_tujuan = produk+'_'+tujuan;
	}else{
		status = 'gagal manual';
		var eprotuj = message.indexOf(' ');
		var protuj = message.substring(0,eprotuj);
		produk_tujuan = protuj.replace('.','_');
	}
	var btime = message.indexOf('@');
	var etime = message.indexOf('.',btime);
	var time = message.substring(btime,etime);
	var doc = {};
	doc['waktu_respon']=time;
	doc['status_message']=status;
	doc['produk_tujuan']=produk_tujuan;
	return doc;
}
function readRef(ref){
	ref = ref.toLowerCase();
	ref_ret = {};
	var tagihan;
	var total;
	var bayar;
	var lastIndexOfRp = 0;
	var lastIndexOfO = 0;
	if(ref.includes('premi') || ref.includes('tagihan')){
		var btag = ref.indexOf('rp',lastIndexOfRp);
		var etag = ref.indexOf(',00',lastIndexOfO);
		lastIndexOfRp = btag+1;
		lastIndexOfO = etag+1;
		tagihan = ref.substring(btag,etag);
		var btot = ref.indexOf('rp',lastIndexOfRp);
		var etot = ref.indexOf(',00',lastIndexOfO);
		lastIndexOfRp = btot+1;
		lastIndexOfO = etot+1;
		var badm = ref.indexOf('rp',lastIndexOfRp);
		var eadm = ref.indexOf(',00',lastIndexOfO); 
		admin = ref.substring(badm,eadm);
		lastIndexOfRp = badm+1;
		lastIndexOfO = eadm+1;
		total = ref.substring(btot,etot);
		var bbyr = ref.indexOf('rp',lastIndexOfRp);
		var ebyr = ref.indexOf(',00',lastIndexOfO); 
		bayar = ref.substring(bbyr,ebyr);
		ref_ret['tagihan']=tagihan.replace('.','').replace('rp','');
		ref_ret['admin']=total.replace('.','').replace('rp','');
		ref_ret['total']=admin.replace('.','').replace('rp','');
		ref_ret['bayar']=bayar.replace('.','').replace('rp','');
		ref_ret['reff']=ref.substring(ref.indexOf('reff')+4);
	}else{
		ref_ret = ref;
	}
	return ref_ret;
}

module.exports = router;