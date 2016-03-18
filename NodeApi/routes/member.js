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

app.post('/', function (req, res, next) {
 	var id_member 		= connection.escape(req.body.id_member);
	var	identity_number = connection.escape(req.body.identity_number);
	var	npwp			= connection.escape(req.body.npwp);
	var	level_member	= connection.escape(req.body.level_member);
	var	updated_at		= connection.escape(req.body.updated_at);
	var	total_komisi	= connection.escape(req.body.total_komisi);
	var	total_saldo		= connection.escape(req.body.total_saldo);
});

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    var session = req.body.session;
	if(session!=null){
		connection.query('Select exists(Select * from users where session = "'+session+'") as result',function(err, rows, fields){
			if(err){
				console.log(err);
				res.json({"status":"error","message":err});
			}else{
				next(); 
			}
		});
	}else{
		res.json({"status":"error","message":"Tidak Ada Session"});
	}
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


router.post("/newMember",function(req, res, next) {
	var id_atasan;
	var newMemberId;
	var session = req.body.session;
	var level_member = req.body.level_member;
	var isInternal = req.body.isInternal;
	var newMemberLevel;
	if(isInternal){
		newMemberLevel = level_member;
	}else{
		newMemberLevel = level_member+1;
	}
	var nama = req.body.nama;
	var simpan = { sql : 'insert into member (identity_number,nama,tgl_lahir,jenis_kelamin, npwp, level_member) values ("'+req.body.identity_number+'" , "'+req.body.nama+'" , "'+req.body.tanggal_lahir+'" , "'+req.body.jenis_kelamin+'" , "'+req.body.npwp+'" , "'+req.body.level_member+'")' };
	async.series([
        //Load user to get userId first
        function(callback){
        	var getIdMember ='SELECT member_id FROM users WHERE session ="'+session+'"';
        	connection.query(getIdMember,function(err,rows){
        		if (err){
				   console.log(err);
				   res.json({"inserted" : false,"message":err});
				}else{
					id_atasan= rows[0].member_id;
					console.log(id_atasan);
					callback();
				}
        	});
        },
        function(callback) {
        	connection.query(simpan, function(err, result) {
				if (err){
				   console.log(err);
				   res.json({"inserted" : false,"message":err});
				}else{
					newMemberId = result.insertId;
					console.log('tabel member');
					callback();
					
				}
			});
        },
        //Load posts (won't be called before task 1's "task callback" has been called)
        function(callback) {
        	var addressName = connection.escape(req.body.addressName);
        	var jalan = connection.escape(req.body.jalan);
        	var kec = connection.escape(req.body.kec);
        	var kot = connection.escape(req.body.kot);
        	var prov = connection.escape(req.body.prov);
        	var ket = connection.escape(req.body.ket);
        	console.log(newMemberId);
        	var address_sql = 'INSERT INTO member_address(name,jalan,id_kecamatan,id_kota,id_provinsi,keterangan_tambahan,id_member) VALUES("'+addressName+'","'+jalan+'",'+kec+','+kot+','+prov+',"'+ket+'",'+newMemberId+')';
        	connection.query(address_sql, function(err, result) {
				if (err){
				   console.log(err);
				   res.json({"inserted" : false,"message":err});
				}else{
					//res.json('Inserted: ' + JSON.stringify(rows));
					console.log('tabel address');
					callback();
				}
			});
            // db.query('posts', {userId: userId}, function(err, posts) {
            //     if (err) return callback(err);
            //     locals.posts = posts;
            //     callback();
            // });
        },
        function(callback){
        	var telp = req.body.telp;
        	var email = req.body.email;
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
        		level_table_sql = "INSERT INTO member_koordinator(id_member,id_koordinator) VALUES("+newMemberId+","+id_atasan+")";
        	}else{
        		var pos = req.body.posisi;
        		level_table_sql = 'INSERT INTO member_koordinator(id_member,posisi) VALUES('+newMemberId+',"'+pos+'")';
        	}
        	console.log(newMemberId);
        	connection.query(level_table_sql,function(err,result){
        		if (err){
				   console.log(err);
				   console.log('tabel level');
				   res.json({"inserted" : false,"message":err});
				}else{
					console.log('tabel level');
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
				var regNum = rows[0].reg_num;
				var createdAt = rows[0].created_at;
				res.json({"inserted":true,"nama":nama,"reg_num":regNum,"createdAt":createdAt});
			}
		});
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
module.exports = async;
module.exports = router;