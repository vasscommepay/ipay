var async      = require('async');
var nano   = require('./nano');
var connection = require('./db');

var couchdb = {
	"setNotif":function(to_member,from_member,activity,title,status,message,callback){
		var ipay = nano.db.use('ipay');
		var table = 'notification';
		var doc = {};
		doc['table']=table;
		doc['from']=from_member;
		doc['to_member']=to_member;
		doc['activity']=activity;
		doc['title']=title;
		doc['status']=status;
		doc['message']=message;
		doc['timestamp']= Date.now();
		ipay.insert(doc,function(err,body){
			if(err){
				callback(err)
			}else{
				callback(null,body);
			}
		});
	}
	,
	"getNotif":function(status,member,callback){
		var ipay = nano.db.use('ipay');
		ipay.view('notification',status+'_notif',{keys:[member]},function(err,body){
			if(err){
				callback(err);
			}else{
				callback(null,body);
			}
		});
	}
	,
	"activityLog":function(username,req,res,status,callback){
		var ipay = nano.db.use('ipay');
		var table = 'activity_log';
		var timestamp = Date.now();
		var doc = {};
		doc['table']=table;
		doc['user']=username;
		doc['req']=req;
		doc['res']=res;
		doc['timestamp']=timestamp.toString();
		doc['status']=status;
		ipay.insert(doc,function(err,body){
			if(err){
				callback(err);
			}else{
				callback(null,body);
			}
		});
	}
	,
	"respondLog":function(respond,status,callback){
		var ipay = nano.db.use('ipay');
		var doc = {};
		var timestamp = Date.now();
		doc['timestamp']=timestamp.toString();
		doc['table']='respond_log';
		doc['status']=status;
		doc['respond']=respond;
		ipay.insert(doc,function(err,body){
			if(err){
				callback(err);
			}else{
				callback(null,body);
			}
		});
	}
	,
	"exportUser":function(callback){
		var users_db = nano.db.use('ipay_users');
		var sql = "Select * FROM users";
		getData(sql,function(err,rows){
			if(err){
				console.log(err);
				callback(err);
			}else{
				var bod = [];
				async.each(rows,function(user,callback){
					var username = user.username;
					users_db.insert(user,username,function(err,body){
						if(err){
							callback(err);
						}else{
							bod.push(body);
							var update = "UPDATE users SET rev ='"+body.rev+"' WHERE username ='"+username+"'";
							getData(update,function(err,rows){
								if(err){
									callback(err);
								}else{
									callback();
								}
							});
						}
					});
				},
				function(err){
					if(err){
						console.log(err);
						callback(err);
					}else{
						callback(null,bod);
					}
				});
			}
		});
	}
	,"exportSingleUser":function(username, callback){
		var users_db = nano.db.use('ipay_users');
		var sql = "Select * FROM users WHERE username="+connection.escape(username);
		getData(sql,function(err,rows){
			if(err){
				console.log(err);
				callback(err);
			}else{
				users_db.insert(rows[0],username,function(err,body){
					if(err){
						callback(err);
					}else{ 
						var update = "UPDATE users SET rev ='"+body.rev+"' WHERE username ='"+username+"'";
						getData(update,function(err,rows){
							if(err){
								callback(err);
							}else{
								callback(null,body);
							}
						});
					}
				});
			}
		});
	}
	,"getMember":function(callback){
		var member_db = nano.db.use('ipay_member');
		member_db.get(1,function(err,rows){
			if(err){
				callback(err);
			}else{
				callback(null,rows);
			}
		});
	}
	,"exportMember":function(callback){
		var member_db = nano.db.use('ipay_member');
		var beginall = Date.now();
		connection.query("SELECT * FROM member",function(err,rows){
			var bod = [];
			async.each(rows,function(member,callback){
				var id_member = member.id_member;
				var nama = member.nama;
				var tgl_lahir = member.tgl_lahir;
				var jenis_kelamin = member.jenis_kelamin;
				var identity_number = member.identity_number;
				var npwp = member.npwp;
				var level_member = member.level_member;
				var total_saldo = member.total_saldo;
				var total_komisi = member.total_komisi;
				var reg_num = member.reg_num;
				var max_users = member.max_users;
				var cur_user = member.current_users;
				var address = member.id_address;
				var level0 = 1;
				var level1_list=[];
				var level2_list=[];
				var level3_list=[];
				var get_level1;
				var get_level2;
				var get_level3;
				var deposit = null;
				var get_contact = "SELECT name,channel_id,channel_value FROM member_contact WHERE id_member="+id_member;
				var contact_list;
				if(level_member==1){
					get_level1 = null;
					get_level2 = "SELECT id_member FROM member_koordinator WHERE id_korwil="+id_member;
					get_level3 = "SELECT id_member FROM member_agen WHERE id_koordinator IN (SELECT id_member FROM member_koordinator WHERE id_korwil ="+id_member+")";
					level1_list = null;
				}else if(level_member==2){
					get_level1 = "SELECT id_korwil FROM member_koordinator WHERE id_member ="+id_member;
					get_level2 = null;
					get_level3 = "SELECT id_member FROM member_agen WHERE id_koordinator="+id_member;
					level2_list = null;
				}else if(level_member==3){
					get_level1 = "SELECT id_korwil FROM member_koordinator WHERE id_member IN(SELECT id_koordinator FROM member_agen WHERE id_member ="+id_member+")";
					get_level2 = "SELECT id_koordinator FROM member_agen WHERE id_member="+id_member;
					get_level3 = null;
					level3_list = null;
				}else{
					get_level1 = "SELECT id_member FROM member_korwil";
					get_level2 = "SELECT id_member FROM member_koordinator";
					get_level3 = "SELECT id_member FROM member_agen";
				}
					async.series([
						function(callback){
							//Get level 1 member
							var begin = Date.now();
							if(get_level1!=null){
								getData(get_level1,function(err,rows){
									var speed = Date.now()-begin;
									if(err){
										console.log(err);
										callback(err);
									}else{

										console.log("Get level 1 for member: "+id_member+" finished id "+speed+"ms");
										level1_list = rows;
										callback();
									}
								});
							}else{
								callback();
							}
						},
						function(callback){
							//Get level 2 member
							var begin = Date.now();
							if(get_level2!=null){
								getData(get_level2,function(err,rows){
									var speed = Date.now()-begin;
									if(err){
										console.log(err);
										callback(err);
									}else{
										console.log("Get level 2 for member: "+id_member+"  finished id "+speed+"ms");
										level2_list = rows;
										callback();
									}
								});
							}else{
								callback();
							}
						},
						function(callback){
							//Get level 3 member
							var begin = Date.now();
							if(get_level3!=null){
								getData(get_level3,function(err,rows){
									var speed = Date.now()-begin;
									if(err){
										console.log(err);
										callback(err);
									}else{
										console.log("Get level 3 for member: "+id_member+"  finished id "+speed+"ms");
										level3_list = rows;
										callback();
									}
								});
							}else{
								callback();
							}
						},
						function(callback){
							//get member contact
							var begin = Date.now();
							getData(get_contact,function(err,contact){
								var speed = (Date.now()-begin);
								if(err){
									console.log(err);
									callback(err);
								}else{
									console.log("Get contact for member: "+id_member+"  finished id "+speed+"ms");
									contact_list = contact;
									callback();
								}
							});
						}
						// ,function(callback){
						// 	if(get_level1!=null){
						// 		connection.query("SELECT total_deposit FROM member_korwil WHERE id_member="+connection.escape(id_member),function(err,rows){
						// 			if(err)callback(err);
						// 			deposit = rows.total_deposit;
						// 			callback();
						// 		});
						// 	}
						// }
						,
						function(callback){
							if(err){

							}else{
								var doc = {nama:nama,tgl_lahir:tgl_lahir,jk:jenis_kelamin,id_num:identity_number,npwp:npwp,level:level_member,komisi:total_komisi,saldo:total_saldo,reg_num:reg_num,max_users:max_users,cur_user:cur_user,address:address,lv0:1,lv1:level1_list,lv2:level2_list,lv3:level3_list,contact:contact_list};
								if(deposit!=null){
									doc['deposit']=deposit;
								}
								var begin = Date.now();
								member_db.insert(doc,""+id_member+"",function(err,body){
									if(err){
										console.log(err);
										callback(err);
									}else{
										bod.push(body);
										var speed = Date.now()-begin;
										console.log("Insert into couchdb for member: "+id_member+" finised in: "+speed+"ms");
										console.log("################ Finish exporting member: "+id_member+" ##################################");
										callback();
									}
								});			
							}
						}
					],
					callback);
				}
				,
				function(err){
				if(err){
					console.log(err);
					callback(err);
				}else{
					var speed = Date.now()-beginall;
					console.log("export member finised in :"+speed+"ms");
					callback(null,bod);
				}
			});
		});
	}
	,"exportSingelMember":function(id_member,callback){
		
		var nama;
		var tgl_lahir;
		var jenis_kelamin;
		var identity_number;
		var level_member;
		var total_saldo;
		var total_komisi;
		var reg_num;
		var max_users;
		var cur_user;
		var address;
		var level0 = 1;
		var level1_list=[];
		var level2_list=[];
		var level3_list=[];
		var get_level1;
		var get_level2;
		var get_level3;
		var deposit = null;
		var get_contact = "SELECT name,channel_id,channel_value FROM member_contact WHERE id_member="+id_member;
		var contact_list;
		
			async.series([
				function(callback){
					getData("SELECT * FROM member WHERE id_member="+connection.escape(id_member),function(err,member){
						if(err){
							callback(err);
						}else{
							nama = member.nama;
							tgl_lahir = member.tgl_lahir;
							jenis_kelamin = member.jenis_kelamin;
							identity_number = member.identity_number;
							npwp = member.npwp;
							level_member = member.level_member;
							total_saldo = member.total_saldo;
							total_komisi = member.total_komisi;
							reg_num = member.reg_num;
							max_users = member.max_users;
							cur_user = member.current_users;
							address = member.id_address;
							if(level_member==1){
								get_level1 = null;
								get_level2 = "SELECT id_member FROM member_koordinator WHERE id_korwil="+id_member;
								get_level3 = "SELECT id_member FROM member_agen WHERE id_koordinator IN (SELECT id_member FROM member_koordinator WHERE id_korwil ="+id_member+")";
								level1_list = null;
							}else if(level_member==2){
								get_level1 = "SELECT id_korwil FROM member_koordinator WHERE id_member ="+id_member;
								get_level2 = null;
								get_level3 = "SELECT id_member FROM member_agen WHERE id_koordinator="+id_member;
								level2_list = null;
							}else if(level_member==3){
								get_level1 = "SELECT id_korwil FROM member_koordinator WHERE id_member IN(SELECT id_koordinator FROM member_agen WHERE id_member ="+id_member+")";
								get_level2 = "SELECT id_koordinator FROM member_agen WHERE id_member="+id_member;
								get_level3 = null;
								level3_list = null;
							}else{
								get_level1 = "SELECT id_member FROM member_korwil";
								get_level2 = "SELECT id_member FROM member_koordinator";
								get_level3 = "SELECT id_member FROM member_agen";
							}
							callback();
						}
					});
				}
				,
				function(callback){
					//Get level 1 member
					var begin = Date.now();
					if(get_level1!=null){
						getData(get_level1,function(err,rows){
							var speed = Date.now()-begin;
							if(err){
								console.log(err);
								callback(err);
							}else{

								console.log("Get level 1 for member: "+id_member+" finished id "+speed+"ms");
								level1_list = rows;
								callback();
							}
						});
					}else{
						callback();
					}
				},
				function(callback){
					//Get level 2 member
					var begin = Date.now();
					if(get_level2!=null){
						getData(get_level2,function(err,rows){
							var speed = Date.now()-begin;
							if(err){
								console.log(err);
								callback(err);
							}else{
								console.log("Get level 2 for member: "+id_member+"  finished id "+speed+"ms");
								level2_list = rows;
								callback();
							}
						});
					}else{
						callback();
					}
				},
				function(callback){
					//Get level 3 member
					var begin = Date.now();
					if(get_level3!=null){
						getData(get_level3,function(err,rows){
							var speed = Date.now()-begin;
							if(err){
								console.log(err);
								callback(err);
							}else{
								console.log("Get level 3 for member: "+id_member+"  finished id "+speed+"ms");
								level3_list = rows;
								callback();
							}
						});
					}else{
						callback();
					}
				},
				function(callback){
					//get member contact
					var begin = Date.now();
					getData(get_contact,function(err,contact){
						var speed = (Date.now()-begin);
						if(err){
							console.log(err);
							callback(err);
						}else{
							console.log("Get contact for member: "+id_member+"  finished id "+speed+"ms");
							contact_list = contact;
							callback();
						}
					});
				}
				// ,function(callback){
				// 	if(get_level1!=null){
				// 		connection.query("SELECT total_deposit FROM member_korwil WHERE id_member="+connection.escape(id_member),function(err,rows){
				// 			if(err)callback(err);
				// 			deposit = rows.total_deposit;
				// 			callback();
				// 		});
				// 	}
				// }
				,
				function(callback){
					if(err){

					}else{
						var doc = {nama:nama,tgl_lahir:tgl_lahir,jk:jenis_kelamin,id_num:identity_number,npwp:npwp,level:level_member,komisi:total_komisi,saldo:total_saldo,reg_num:reg_num,max_users:max_users,cur_user:cur_user,address:address,lv0:1,lv1:level1_list,lv2:level2_list,lv3:level3_list,contact:contact_list};
						if(deposit!=null){
							doc['deposit']=deposit;
						}
						var begin = Date.now();
						member_db.insert(doc,""+id_member+"",function(err,body){
							if(err){
								console.log(err);
								callback(err);
							}else{
								bod.push(body);
								var speed = Date.now()-begin;
								console.log("Insert into couchdb for member: "+id_member+" finised in: "+speed+"ms");
								console.log("################ Finish exporting member: "+id_member+" ##################################");
								callback();
							}
						});			
					}
				}
			],
			callback);
	}
	,"exportForm":function(callback){
		var form_db = nano.db.use('ipay_form');
		var bod = [];
		sql = "SELECT DISTINCT id_kategori FROM kategori_form";
		getData(sql,function(err,rows){
			if(err) console.log(err);
			async.each(rows,function(kategori,callback){
				var id_kategori = kategori.id_kategori;
				var prop = [];
				sql = "SELECT * FROM kategori_form WHERE id_kategori = '"+id_kategori+"'";
				getData(sql,function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						var i = 0;
						for(i=0;i<rows.length;i++){
							var prop_id = {};
							var input_name = rows[i].input_name;
							var input_type = rows[i].input_type;
							var input_label = rows[i].input_label;
							prop_id["input_name"]=input_name;
							prop_id["input_type"]=input_type;
							prop_id["input_label"]=input_label;
							prop.push(prop_id);
						}
						console.log(id_kategori);
						//callback();
						form_db.insert({prop:prop},id_kategori,function(err,body){
							if(err) console.log(err);
							bod.push(body);
							if(body.rev!=null){
								connection.query("UPDATE kategori_form SET rev ='"+body.rev+"' WHERE id_kategori ='"+id_kategori+"'", function(err,result){
									if(err)console.log(err);
									callback();
								});
							}else{
								callback();
							}
						});
					}
				});
			},
			function(err){
				if(err){
					console.log(err);
					callback(err);
				}else{
					callback(null,true);
				}
			});
		});
	}
	,"updateForm":function(callback){
		var form_db = nano.db.use('ipay_form');
		var bod = [];
		sql = "SELECT DISTINCT id_kategori FROM kategori_form";
		getData(sql,function(err,rows){
			if(err) console.log(err);
			async.each(rows,function(kategori,callback){
				var id_kategori = kategori.id_kategori;
				var prop = [];
				sql = "SELECT * FROM kategori_form WHERE id_kategori = '"+id_kategori+"'";
				getData(sql,function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						var rev = rows[0].rev;
						var i = 0;
						for(i=0;i<rows.length;i++){
							var prop_id = {};
							var input_name = rows[i].input_name;
							var input_type = rows[i].input_type;
							var input_label = rows[i].input_label;
							prop_id["input_name"]=input_name;
							prop_id["input_type"]=input_type;
							prop_id["input_label"]=input_label;
							prop.push(prop_id);
						}
						console.log(id_kategori);
						//callback();
						form_db.insert({_id:id_kategori,_rev:rev,prop:prop},function(err,body){
							if(err){
								console.log(err);
								callback(err);
							}else{
								if(body.rev!=null){
									bod.push(body);
									connection.query("UPDATE kategori_form SET rev ='"+body.rev+"' WHERE id_kategori ='"+id_kategori+"'", function(err,result){
										if(err)console.log(err);
										callback();
									});
								}else{
									callback();
								}
							}
						});
					}
				});
			},
			function(err){
				if(err){
					console.log(err);
					callback(err);
				}else{
					callback(null,bod);
				}
			});
		});
	}
	,"exportSingleForm":function(id_kategori,callback){
		var form_db = nano.db.use('ipay_form');
		var bod = [];
		
		var prop = [];
		sql = "SELECT * FROM kategori_form WHERE id_kategori = '"+id_kategori+"'";
		getData(sql,function(err,rows){
			if(err){
				console.log(err);
				callback(err);
			}else{
				var i = 0;
				for(i=0;i<rows.length;i++){
					var prop_id = {};
					var input_name = rows[i].input_name;
					var input_type = rows[i].input_type;
					var input_label = rows[i].input_label;
					prop_id["input_name"]=input_name;
					prop_id["input_type"]=input_type;
					prop_id["input_label"]=input_label;
					prop.push(prop_id);
				}
				console.log(id_kategori);
				//callback();
				form_db.insert({prop:prop},id_kategori,function(err,body){
					if(err) console.log(err);
					bod.push(body);
					if(body.rev!=null){
						connection.query("UPDATE kategori_form SET rev ='"+body.rev+"' WHERE id_kategori ='"+id_kategori+"'", function(err,result){
							if(err)console.log(err);
							callback(err);
						});
					}else{
						callback(null,bod);
					}
				});
			}
			
		});
		
	}
	,"updateDb":function(dbname,doc_id,params,callback){
		var db = nano.db.use(dbname);
		var oldbody;
		var newbody;
		async.series([
			function(callback){
				db.get(doc_id,function(err,body){
					if(err){
						callback(err);
					}else{
						if(body.length==0){
							callback("no record found");
						}else{
							oldbody = body;
							//console.log("doc_id: ",doc_id);
							//console.log('oldbody: ',oldbody);
							callback();
						}
					}
				});
			}
		],function(err){
			if(err){
				callback(err);
				//console.log("Updatedb ERORR: "+err);
			}else{
				//delete oldbody.rev;
				for(keys in params){
					//console.log("keys: "+keys);
					//console.log("values: "+params[keys]);
					oldbody[keys]=params[keys];
				}
				db.insert(oldbody,function(err,body){
					if(err){
						callback(err);
						//console.log("Updatedb ERORR: "+err);
					}else{
						callback(null,body);
					}
				});
			}
		});
	}
	,"exportProduk":function(callback){
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
			var bod = [];
			async.each(produks,function(produk,callback){
				var id_produk = produk.id;
				var nama = produk.nama;
				var harga = produk.harga_beli;
				var nominal = produk.nominal;
				var tipe = produk.tipe;
				var result;
				var start = Date.now();
				var aktif = true;
				if(produk.aktif!=1) aktif = false;
				var kosong = false;
				if(produk.kosong!=0) kosong = true;
				var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ='"+id_produk+"' ; SELECT harga_terkini, id_supplier FROM supplier_produk WHERE id_produk ='"+id_produk+"'";

				connection.query(sql,function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						if(rows[0].length==0){
							console.log("nodata");
							err = "no data found";
							callback(err);
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
								var harga_terkini = supplierList[i].harga_terkini;
								supplier[supplier_id]=harga_terkini;
							}
							// var newRow = '{id:'+id_produk+',nama:"'+nama+'",harga:'+harga+',nominal:'+nominal+',aktif:'+aktif+',kosong:'+kosong+',harga_beli:{'+harga_beli+'},harga_jual:{'+harga_jual+'}}';
							
							var row = {nama:nama,harga:harga,nominal:nominal,tipe:tipe,aktif:aktif,kosong:kosong,harga_beli:harga_beli,harga_jual:harga_jual,supplier:supplier};
							//console.log(newRow);

							ipay.insert(row,id_produk,function(err,body){
								if(err){
									console.log(err);
									callback(err);
									
								}else{
									console.log
									bod.push(body);
									getData("UPDATE master_produk SET rev ='"+body.rev+"' WHERE id ='"+id_produk+"'", function(err,result){
										if(err){
											callback(err);
										}else{
											callback();
										}
									});
								}
							});

						}
					}
				});
			},function(err){
				if(err) {
					console.log(err);
					callback(err);
				}else{
					callback(null,bod);
				}
			});
		});
	}
	,"exportSingleProduk":function(id_produk,callback){
		var ipay = nano.db.use('ipay_produk');
		var produk;
		var row;
		var newrev;
		var bod;
		console.log('export produk: '+id_produk);
		async.series([
			function(callback){
				connection.query("SELECT * FROM master_produk WHERE id="+connection.escape(id_produk),function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						if(rows.length==0){
							console.log("nodata");
							callback('nodata');
						}else{
							produk = rows[0];
							console.log(rows[0]);
							callback();
						}
					}
				});
			},
			function(callback){
				var nama = produk.nama;
				var harga = produk.harga_beli;
				var nominal = produk.nominal;
				var result;
				var tipe = produk.tipe;
				var start = Date.now();
				var aktif = true;
				if(produk.aktif!=1) aktif = false;
				var kosong = false;
				if(produk.kosong!=0) kosong = true;
				var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ='"+id_produk+"' ; SELECT harga_terkini, id_supplier FROM supplier_produk WHERE id_produk ='"+id_produk+"'";

				connection.query(sql,function(err,rows){
					if(err){
						console.log(err);
						callback(err);
					}else{
						if(rows[0].length==0){
							console.log("nodata");
							err = "no data found";
							callback(err);
						}else{
							var memberList = rows[0];
							var supplierList = rows[1];
							var harga_beli ={};
							var harga_jual={};
							var supplier={};
							var memlen = memberList.length;
							var suplen = supplierList.length;
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
								var harga_terkini = supplierList[i].harga_terkini;
								supplier[supplier_id]=harga_terkini;
							}
							var newRow = '{id:'+id_produk+',nama:"'+nama+'",harga:'+harga+',nominal:'+nominal+',aktif:'+aktif+',kosong:'+kosong+',harga_beli:{'+harga_beli+'},harga_jual:{'+harga_jual+'}}';
							
							row = {nama:nama,harga:harga,nominal:nominal,tipe:tipe,aktif:aktif,kosong:kosong,harga_beli:harga_beli,harga_jual:harga_jual,supplier:supplier};
							callback();
						}
					}
				});
			},
			function(callback){
				ipay.insert(row,id_produk,function(err,body){
					if(err){
						console.log(err);
						callback(err);						
					}else{
						console.log(body);
						newrev = body.rev;
						bod = body;
						callback();
					}
				});
			},
			function(callback){
				getData("UPDATE master_produk SET rev ='"+newrev+"' WHERE id ='"+id_produk+"'", function(err,result){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			}
		],function(err){
			if(err) {
				console.log(err);
				callback(err);
			}else{
				callback(null,bod);
			}
		});
	}
	,"updateProduk":function(callback){
		var status = 'gagal';
		var ipay = nano.db.use('ipay_produk');
		var produks;
		var bod=[];
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
					var tipe = produk.tipe;
					var result;
					var start = Date.now();
					var aktif = true;
					if(produk.aktif!=1) aktif = false;
					var kosong = false;
					if(produk.kosong!=0) kosong = true;
					var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ='"+id_produk+"' ;  SELECT harga_terkini, id_supplier FROM supplier_produk WHERE id_produk ='"+id_produk+"'";

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
									var harga_terkini = supplierList[i].harga_terkini;
									supplier[supplier_id]=harga_terkini;
								}
								
								var row = {nama:nama,harga:harga,nominal:nominal,aktif:aktif,tipe:tipe,kosong:kosong,harga_beli:harga_beli,harga_jual:harga_jual,supplier:supplier};

								updateDb('ipay_produk',id_produk,row,function(err,body){
									if(err){
										console.log(err);
										callback(err);
									}else{
										getData("UPDATE master_produk SET rev ='"+body.rev+"' WHERE id ='"+id_produk+"'", function(err,result){
											if(err){
												callback(err);
											}else{
												bod.push(body);
												callback();
											}
										});
									}
								});
							}
						}
					});
				},
			function(err){
				if(err){
					callback(err);
				}else{
					status = 'sukses';
					callback(null,bod);
				}
				
			});
		});
	}
	,"updateSingleProduk":function(id_produk,callback){
		var status = 'gagal';
		var ipay = nano.db.use('ipay_produk');
		var produk;
		var newrev;
		var bod;
		var row;
		async.series([
			function(callback){
				connection.query("SELECT * FROM master_produk WHERE id='"+id_produk+"'",function(err,rows){
					if(err){
						console.log(err);
						res.json({"exported":false,"message":err});
					}else{
						if(rows.length==0){
							console.log("nodata");
							callback(err);
						}else{
							produk = rows[0];
							callback();
						}
					}
				});
			},
			function(callback){
				var rev = produk.rev;
				var nama = produk.nama;
				var harga = produk.harga_beli;
				var nominal = produk.nominal;
				var tipe = produk.tipe;
				var result;
				var start = Date.now();
				var aktif = true;
				if(produk.aktif!=1) aktif = false;
				var kosong = false;
				if(produk.kosong!=0) kosong = true;
				var sql = "SELECT member_id,harga_jual,harga_beli FROM produk_member WHERE product_id ='"+id_produk+"' ;  SELECT harga_terkini, id_supplier FROM supplier_produk WHERE id_produk ='"+id_produk+"'";
				console.log(sql);
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
								var harga_terkini = supplierList[i].harga_terkini;
								supplier[supplier_id]=harga_terkini;
							}
							row = {nama:nama,harga:harga,nominal:nominal,aktif:aktif,tipe:tipe,kosong:kosong,harga_beli:harga_beli,harga_jual:harga_jual,supplier:supplier};
							callback();
						}
					}
				});
			},
			function(callback){
				updateDb('ipay_produk',id_produk,row,function(err,body){
					if(err){
						callback(err);
					}else{
						callback();
					}
				});
			},
			function(callback){
				getData("UPDATE master_produk SET rev ='"+newrev+"' WHERE id ='"+id_produk+"'", function(err,result){
					if(err){
						console.log(err);
						callback(err);
					}else{
						callback();
					}
				});
			}
		],function(err){
			if(err){
				console.log(err);
				callback(err);
			}else{
				status = 'sukses';
				console.log('sukses');
				callback(null,bod);
			}
		});
	}
	,"exportSupplier":function(callback){
		var sql = 'SELECT * FROM supplier';
		var gateways = {};
		var bod = [];
		getData(sql,function(err,suppliers){
			if(err){
				console.log(req.url,err);
				res.json({"error":true,"message":err});
			}else{
				async.each(suppliers,function(supplier,callback){
					var id_supplier = supplier.id_supplier;
					var sql = "SELECT * FROM supplier_gateway where id_supplier="+connection.escape(id_supplier);
					getData(sql,function(err,gateway){
						if(err){callback(err);}
						var id = gateway.idsupplier_gateway;
						var method = gateway.metode;
						var address = gateway.address;
						var format = gateway.format_kirim;
						gateways[id]={'metode':method,'address':address,'format':format};
						var supplier_db = nano.db.use('ipay_supplier');
						delete supplier.id;
						supplier_db.insert({supplier,gw:gateways},id_supplier,function(err,body){
							if(err){callback(err);}
							bod.push(body);
							callback();
						});
					});
				}
				,function(err){
					if(err){
						callback(err);
					}else{
						callback(null,bod);
					}
				});
			}
		});
	}
	,"exportNewSupplier":function(id_supplier,callback){
		var sql = 'SELECT * FROM supplier WHERE id_supplier="'+id_supplier+'"';
		var gateways = {};
		var bod = [];
		//console.log(sql);
		getData(sql,function(err,supplier){
			if(err){
				//console.log(err);
				callback(err);
			}else{
				var sql = "SELECT * FROM supplier_gateway where id_supplier='"+id_supplier+"'";
				getData(sql,function(err,gateway){
					if(err){
						callback(err);
					}else{
						var id = gateway.idsupplier_gateway;
						var method = gateway.metode;
						var address = gateway.address;
						var format = gateway.format_kirim;
						gateways[id]={'metode':method,'address':address,'format':format};
						var supplier_db = nano.db.use('ipay_supplier');
						//delete supplier.id;
						supplier_db.insert({supplier,gw:gateways},id_supplier,function(err,body){
							if(err){
								callback(err);
							}else{
								bod.push(body);
								callback(null,bod);
							}
						});
					}
				});
			}
			
		});
	}
	,"getProduk":function(id_produk,callback){
		var produk = nano.db.use('ipay_produk');
		produk.get(id_produk,function(err,hasil){
			if(err){
				callback(err);
			}else{
				callback(null,hasil.harga_beli);
			}
		});
	}
	,"deleteDoc":function(dbname,docname,callback){
		var db = nano.db.use(dbname);
		var rev;
		var result;
		async.series([
			function(callback){
				db.get(docname,function(err,body){
					if(err){
						callback(err);
					}else{
						rev = body.rev;
						callback();
					}
				});
			}
			,function(callback){
				db.destroy(docname,rev,function(err,body){
					if(err){
						callback(err);
					}else{
						result = body;
						callback();
					}
				});
			}
		]
		,function(err){
			if(err){
				callback(err);
			}else{
				callback(null,result);
			}
		});
	}
}

function getData(sql,callback){
	connection.query(sql,function(err,rows){
		if(err){
			callback(err);
		}else{
			if(rows.length==0){
				err = sql+"empty table";
				callback(null,null);
			}else{
				callback(null,rows);
			}
		}
	});
}

function updateDb(dbname,doc_id,params,callback){
		var db = nano.db.use(dbname);
		var oldbody;
		var newbody;
		async.series([
			function(callback){
				db.get(doc_id,function(err,body){
					if(err){
						callback(err);
					}else{
						if(body.length==0){
							callback("no record found");
						}else{
							oldbody = body;
							//console.log("doc_id: ",doc_id);
							//console.log('oldbody: ',oldbody);
							callback();
						}
					}
				});
			}
		],function(err){
			if(err){
				callback(err);
				//console.log("Updatedb ERORR: "+err);
			}else{
				//delete oldbody.rev;
				for(keys in params){
					//console.log("keys: "+keys);
					//console.log("values: "+params[keys]);
					oldbody[keys]=params[keys];
				}
				db.insert(oldbody,function(err,body){
					if(err){
						callback(err);
						//console.log("Updatedb ERORR: "+err);
					}else{
						callback(null,body);
					}
				});
			}
		});
	}

module.exports = couchdb;