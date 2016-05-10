
var express 	= require('express');
var async 		= require('async');
var router 		= express.Router();
var bodyParser 	= require('body-parser');
var connection  = require('./db');
var mailer      = require('express-mailer');
var couchdb = require('./couchdbfunction');
var nodemailer = require('nodemailer');
var nano   = require('./nano');
var app = express();
var cek_session = require('./session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function (req, res, next) {
 	var id_member 		= connection.escape(req.body.id_member);
	var	identity_number = connection.escape(req.body.identity_number);
	var	npwp			= connection.escape(req.body.npwp);
	var	level_member	= connection.escape(req.body.level_member);
	var	updated_at		= connection.escape(req.body.updated_at);
	var	total_komisi	= connection.escape(req.body.total_komisi);
	var	total_saldo		= connection.escape(req.body.total_saldo);
});



router.use(function(req, res, next) {//Untuk cek apakah ada session
	//console.log(req.method, req.url);
	var session = req.body.session;
	if(session!=null){
		cek_session(session,function(err,exists,timeout,username){
			if(err){
				res.json({"error":true,"message":err});
			}else{
				if(exists){
					req.username = username;
					//console.log('username: ',username);
					next();
				}else if(timeout){
					req.username = username;
					//console.log('username: ',username);
					res.json({"error":true,"timeout":true});
				}
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
});

router.post('/get-komisi',function(req,res){
	var id_member = connection.escape(req.body.id_member);
	var query = "SELECT total_komisi FROM member WHERE id_member="+id_member;
	connection.query(query,function(err,rows){
		if(err){
			console.log(err);
			res.json({'error':true,'message':err});
		}else if(rows.length==0){
			console.log('not found');
			res.json({'error':true,'message':'not found'});
		}else{
			res.json(rows);
		}
	});
});

router.post("/tampil-get",function(req, res, next) {
	var tampilGet = { sql : 'SELECT * from member' }

	connection.query(tampilGet, function(err, rows, fields) {
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(rows);

		}
	});
});

router.post('/get-downlink',function(req,res){
	var level = req.body.level;
	var memberid = req.body.id_member;
	var sql;
	if(level==1){
		sql = "SELECT * FROM member WHERE id_member IN (SELECT id_member FROM member_koordinator WHERE id_korwil = "+memberid+")";
	}else if(level==2){
		sql = "SELECT * FROM member WHERE id_member IN(SELECT id_member FROM member_agen WHERE id_koordinator ="+memberid+")";
	}else {
		sql = "SELECT * FROM member WHERE level_member = 1";
	}
	console.log(level,sql);
	connection.query(sql,function(err,rows){
		if(err){
			console.log(err);
			res.json({"isSuccess":false,"message":err});
		}else{
			if(rows[0]==null){
				console.log("empty row");
				res.json({"isSuccess":false,"message":"No record found"});
			}else{
				res.json(rows);
			}
		}
	});
});


router.post("/contactChannel", function(req,res,next){
	var sql = "SELECT * FROM contact_channel";
	connection.query(sql,function(err,rows){
		if (err){
		   console.log(err);
		   res.json({"status":"error","message":err});
		}else{
			res.json(rows);
		}
	})
});
router.post("/tampil-post",function(req, res, next) {
	var tampilPost = { sql : 'SELECT * from member where id_member="'+req.body.id_member+'"' }
	connection.query(tampilPost, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Inserted: ' + JSON.stringify(rows));
			res.json(rows);
		}
	});
});

router.post("/getAllNotif",function(req,res){
	console.log(req.method, req.url);
	var id_member = req.body.id_member;
	var status = req.body.status;
	var knowed = req.body.knowed;
	var this_body;
	var rows;
	var results =[];
	var respond;
	async.series([
		function(callback){
			//console.log('get notif');
			couchdb.getNotif(status,id_member,function(err,body){
				if(err){
					callback(err);
				}else{
					this_body = body;
					rows = body.rows;
					callback();
				}
			});
		}
		,
		function(callback){
			async.each(rows,function(row,callback){
				var value = row.value;
				var id = row.id;
				var member = value.from;
				var member_db = nano.db.use('ipay_member');
				member_db.get(member,function(err,body){
					if(err){
						callback(err);
					}else{
						value['from']=body.nama;
						results.push(value);
						callback();
						// couchdb.updateDb('ipay',id,{'status':'posted'},function(err,body){
						// 	if(err){
						// 		callback(err);
						// 	}else{
						// 		console.log(id,'updated');
						// 		
						// 	}
						// });
					}
				});
			}
			,
			callback);
		}
	]
	,function(err){
		if(err){
			console.log(err);
			respond = {'error':true,'msg':err};
		}else{
			respond = results;
		}
		res.json(respond);
		//couchdb.activityLog(req.username,req.url,respond,res.statusCode,function(err,body){});
	});
	
});
router.post("/getNotif",function(req,res){
	//console.log(req.method, req.url);
	var id_member = req.body.id_member;
	var status = req.body.status;
	var knowed = req.body.knowed;
	var this_body;
	var rows;
	var results =[];
	var respond;
	async.series([
		function(callback){
			//console.log('get notif');
			couchdb.getNotif(status,id_member,function(err,body){
				if(err){
					callback(err);
				}else{
					this_body = body;
					rows = body.rows;
					callback();
				}
			});
		}
		,
		function(callback){
			async.each(rows,function(row,callback){
				var value = row.value;
				var id = row.id;
				var member = value.from;
				var member_db = nano.db.use('ipay_member');
				member_db.get(member,function(err,body){
					if(err){
						callback(err);
					}else{
						value['from']=body.nama;
						results.push(value);
						couchdb.updateDb('ipay',id,{'status':'posted'},function(err,body){
							if(err){
								callback(err);
							}else{
								console.log(id,'updated');
								callback();
							}
						});
					}
				});
			}
			,
			callback);
		}
	]
	,function(err){
		if(err){
			console.log(err);
			respond = {'error':true,'msg':err};
		}else{
			respond = results;
		}
		res.json(respond);
		//couchdb.activityLog(req.username,req.url,respond,res.statusCode,function(err,body){});
	});
	
});

router.post("/newMember",function(req, res, next) {
	var start = Date.now();
	var regnum = createRegNumber(8);
	var id_atasan;
	var newMemberId;
	var addressId;
	var session = req.body.session;
	var level_member = req.body.level_member;
	var isInternal = req.body.isInternal;
	var newMemberLevel;
	console.log(isInternal);
	if(isInternal=="true"){
		newMemberLevel = level_member;
	}else{
		newMemberLevel = level_member+1;
		console.log("newlevel="+newMemberLevel);
	}
	var nama = req.body.nama;
	var email;
	async.series([
        //Load user to get userId first
        function(callback){
        	var getIdMember ='SELECT member_id FROM users WHERE session ="'+session+'"';
        	if(req.body.id_atasan!=null){
        		id_atasan = req.boy.id_atasan;
        	}else{
        		connection.query(getIdMember,function(err,rows){
	        		if (err){
					   console.log(err);
					   res.json({"inserted" : false,"message":err});
					}else{
						id_atasan= rows[0].member_id;
						console.log("id atasan= "+id_atasan);
						callback();
					}
	        	});
        	}
        },
        function(callback) {
        	var addressName = connection.escape(req.body.addressName);
        	var jalan = connection.escape(req.body.jalan);
        	var kec = connection.escape(req.body.kec);
        	var kot = connection.escape(req.body.kot);
        	var prov = connection.escape(req.body.prov);
        	var ket = connection.escape(req.body.ket);
        	console.log("memberid= "+newMemberId);
        	var address_sql = 'INSERT INTO address(name,jalan,id_kecamatan,id_kota,id_provinsi,keterangan_tambahan) VALUES("'+addressName+'","'+jalan+'",'+kec+','+kot+','+prov+',"'+ket+'")';
        	connection.query(address_sql, function(err, result) {
				if (err){
				   console.log(err);
				   res.json({"inserted" : false,"message":err});
				}else{
					//res.json('Inserted: ' + JSON.stringify(rows));
					console.log('tabel address');
					addressId = result.insertId;
					console.log('addressid= '+addressId);
					callback();
				}
			});
        },
        function(callback) {
        	var simpan = { sql : 'insert into member (identity_number,nama,tgl_lahir,jenis_kelamin, npwp, level_member,max_users,reg_num,id_address) values ("'+req.body.identity_number+'" , "'+req.body.nama+'" , "'+req.body.tanggal_lahir+'" , "'+req.body.jenis_kelamin+'" , "'+req.body.npwp+'" , "'+newMemberLevel+'",2,"'+regnum+'",'+addressId+')' };
        	connection.query(simpan, function(err, result) {
				if (err){
				   console.log(err);
				   res.json({"inserted" : false,"message":err});
				}else{
					newMemberId = result.insertId;
					console.log('new member= '+newMemberId);
					callback();
					
				}
			});
        },
        //Load posts (won't be called before task 1's "task callback" has been called)
        
        function(callback){
        	var telp = req.body.telp;
        	email = req.body.email;
    		var telp_sql = 'INSERT INTO member_contact(channel_id,channel_value,id_member,name)VALUES("ph","'+telp+'","'+newMemberId+'","defaultph")';
    		var email_sql = 'INSERT INTO member_contact(channel_id,channel_value,id_member,name)VALUES("em","'+email+'","'+newMemberId+'","defaultem")';
    		connection.query(telp_sql, function(err, result) {
				if (err){
				   console.log(err);
				   console.log('tabel contact1');
				   res.json({"inserted" : false,"message":err});
				}else{
					console.log('tabel contact1');
					connection.query(email_sql, function(err, result) {
						if (err){
						   console.log(err);
						   console.log('tabel contact2');
						   res.json({"inserted" : false,"message":err});
						}else{
							console.log('tabel contact2');
							callback();
						}
					});
				}
			});
        },
        function(callback){
        	var level_table_sql;
        	if(newMemberLevel == 1){
        		var wilayah = req.body.wilayah;

        		level_table_sql = "INSERT INTO member_korwil(id_member,id_wilayah) VALUES("+newMemberId+","+wilayah+")";
        	}else if(newMemberLevel == 2){
        		level_table_sql = "INSERT INTO member_koordinator(id_member,id_korwil) VALUES("+newMemberId+","+id_atasan+")";
        	}else if(newMemberLevel == 3){
        		level_table_sql = "INSERT INTO member_agen(id_member,id_koordinator) VALUES("+newMemberId+","+id_atasan+")";
        	}else{
        		var pos = req.body.posisi;
        		level_table_sql = 'INSERT INTO member_internal(id_member,posisi) VALUES('+newMemberId+',"'+pos+'")';
        	}
        	console.log(wilayah);  
        	console.log(newMemberId);
        	connection.query(level_table_sql,function(err,result){
        		if (err){
				   console.log(err);
				   console.log('tabel level False');
				   res.json({"inserted" : false,"message":err});
				}else{
					console.log('tabel level');
					callback();
				}
        	});
        },
        function(callback){
        	var komisi = 0;
        	if(req.body.komisi!=null){
        		komisi = connection.escape(req.body.komisi);
        	}
        	var sql = 'INSERT INTO produk_member (product_id,member_id,harga_beli,harga_jual,keuntungan) SELECT product_id,'+newMemberId+',harga_beli,(harga_beli+'+komisi+'),keuntungan FROM produk_member WHERE member_id ='+id_atasan;
        	connection.query(sql,function(err,result){
        		if (err){
				   console.log(err);
				   res.json({ "inserted" : false,"message":err});
				}else{
					console.log("insert produk sukses");
					callback();
	        	}
        	});
 
        }
        ,function(callback){
        	var role;
        	if(level_member==1){
        		role = "Korwil";
        	}else if(level_member==2){
        		role="Sales / Koordinator Agen";
        	}else{
        		role="Agen";
        	}
        	var message = '<body>    <style type="text/css">    	body{    		font-family: monospace;    		background-color: orange;    	}    	.container{    		margin-left: 10%;    		margin-right: 10%;    	}    	.page{    		top: 0px;    		background-color: white;    	}    	.mail-title{    		top: 0;    		padding-top: 2%;    		text-align: center;    	}    	.mail-body{    		margin-right: 15%;		    margin-left: 15%;		    padding-bottom: 6%;		    margin-top: 3%;    	}    	.mail-footer{    		background-color: dimgrey;		    padding-right: 10%;		    padding-left: 10%;		    padding-top: 4%;		    padding-bottom: 4%;		    position: absolute;		    width: 59%;    	}    	.footer-element{    		width: 30%;    		text-align: justify;		    position: relative;		    padding: 15px;		    display: flex;		    box-sizing: border-box;		    float: left;    	}    </style>	<div class="container">		<div class="page">			<div class="mail-title">				<h2>Selamat Anda Telah Terdaftar Pada iPay</h2>			</div>			<div class="mail-body">				Selamat, anda telah terdaftar sebagai"+role+"ipay<br>				Berikut adalah informasi terkait dengan akun anda:<br>				<ul>					<li>Nama: '+req.body.nama+'</li>					<li>Role: '+role+'</li>					<li>Nomor Registrasi: '+regnum+'</li><b></b>				</ul>				<p>Gunakan nomor registrasi untuk membuat akun baru pada iPay.</p>			</div>		</div>		<div class="mail-footer">    		<div class="footer-element" align="center">    			iPay    		</div>    		<div class="footer-element" align="center">    			Layanan pembayaran    		</div>    		<div class="footer-element" align="center">    			Mantab    		</div>';
        	sendEmail(email,"Registrasi Ipay",message,function(err,info){
        		if(err){
        			callback(err);
        		}else{
        			callback();
        		}
        	});
        }
    ], function(err) {
    	if (err) return next(err);
    	var final_sql = "SELECT * FROM member WHERE id_member ="+newMemberId;
    	connection.query(final_sql, function(err, rows) {
			if (err){
			   console.log(err);
			   res.json({"inserted" : false,"message":err});
			}else{
				var end = Date.now();
				var regNum = rows[0].reg_num;
				var createdAt = rows[0].created_at;	
				couchdb.updateProduk(function(err){
					if(err){
						console.log(err);
						res.json({"inserted":true,"nama":nama,"reg_num":regNum,"createdAt":createdAt,"execuionTime":end-start,"dbupdated":false});
					}else{
						res.json({"inserted":true,"nama":nama,"reg_num":regNum,"createdAt":createdAt,"execuionTime":end-start,"dbupdated":true});
					}
				});
			}
		});
		
    });
				
});

router.post("/get-wilayah",function(req,res){
	var sql = "SELECT * FROM wilayah";
	connection.query(sql,function(err,rows){
		if(err){
			res.json({'error':true,'message':err});
		}else{
			if(rows.length!=0){
				res.json(rows);
			}else{
				res.json({'error':true,'message':'empty row'});
			}
		}
	});
});

router.put("/perbarui",function(req,res,next) {
	var perbarui = { sql : 'update member set identity_number="'+req.body.identity_number+'", updated_at="'+req.body.updated_at+'", npwp="'+req.body.npwp+'", total_komisi="'+req.body.total_komisi+'", total_saldo="'+req.body.total_saldo+'" where (id_member="'+req.body.id_member+'")' };
	connection.query(perbarui, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Updated: ' + JSON.stringify(rows));
			res.json({"status" : "updated"});
		}
	});
				
});

router.delete("/hapus",function(req,res,next) {
	var hapus = { sql : 'delete from member where id_member="'+req.body.id_member+'"' }
	connection.query(hapus, function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			//res.json('Deleted: ' + JSON.stringify(rows));
			res.json({"status" : "deleted"});
		}
	});
				
});

function createRegNumber(length){
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var result = '';
    var d = new Date();
    var day = d.getDate();
    var mon = d.getMonth();
    var month = 0;
    var h = d.getHours();
    var hour = 0;
    if(mon<10){
    	month = '0'.concat((mon+1));
    }else{
    	month = mon+1;
    }
    var year = d.getFullYear();
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    var date = day.toString()+month.toString()+year.toString();
	return result+date;
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

function updateProduk(callback){
	var status = 'gagal';
	var ipay = nano.db.use('ipay_produk');
	var produks;
	async.series([
		function(callback){
			connection.query("SELECT * FROM master_produk",function(err,rows){
				if(err){
					console.log(err);
					res.json({"exported":false,"message":err});
				}else{
					if(rows.length==0){
						console.log("nodata");
						res.json({"exported":false,"message":"no data"});
					}else{
						produks = rows;
						callback();
					}
				}
			});
		}
		],function(err){
			if(err) console.log(err);
			async.each(produks,function(produk,callback){
				var id_produk = produk.id;
				var rev = produk.rev;
				var nama = produk.nama;
				var harga = produk.harga_beli;
				var nominal = produk.nominal;
				var result;
				var start = Date.now();
				var aktif = true;
				if(produk.aktif!=1) aktif = false;
				var kosong = false;
				if(produk.kosong!=0) kosong = true;
				var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ='"+id_produk+"' ; SELECT prioritas,id_supplier FROM supplier_produk WHERE id_produk ='"+id_produk+"' ORDER BY prioritas ASC";

				connection.query(sql,function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						if(rows[0].length==0){
						console.log("nodata");
						}else{
							var memberList = rows[0];
							var supplierList = rows[1];
							var harga_beli ={};
							var harga_jual={};
							var supplier={};
							var memlen = memberList.length;
							var suplen = supplierList.length;
							supplier["count"]=suplen;
							var i;
							for(i = 0;i<memlen;i++){
								var member_id = memberList[i].member_id;
								var hb = memberList[i].harga_beli;
								var hj = memberList[i].harga_jual;
								harga_jual[member_id] = hj;
								harga_beli[member_id] = hb;
							}
							for(i=0;i<suplen;i++){
								var supplier_id = supplierList[i].id_supplier;
								var prioritas = supplierList[i].prioritas;
								supplier[prioritas]=supplier_id;
							}
							var newRow = '{id:'+id_produk+',nama:"'+nama+'",harga:'+harga+',nominal:'+nominal+',aktif:'+aktif+',kosong:'+kosong+',harga_beli:{'+harga_beli+'},harga_jual:{'+harga_jual+'}}';
							
							var row = {_id:id_produk,_rev:rev, nama:nama,harga:harga,nominal:nominal,aktif:aktif,kosong:kosong,harga_beli:harga_beli,harga_jual:harga_jual,supplier:supplier};
							console.log(newRow);

							ipay.insert(row,function(err,body){
								if(err){
									console.log(err);
									callback(err);
								}else{
									console.log
									callback();
								}
							});
						}
					}
				});
			},
		function(err){
			if(err){
				console.log(err);
				callback(err);	
			}else{
				status = 'sukses';
				callback(null,status);
			}
			
		});
	});
}





module.exports = router;