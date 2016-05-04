
var nano   = require('./nano');
var usersdb = nano.db.use('ipay_users');
var couchdb = require('./couchdbfunction');
var session = function cekSession(session,callback) {
	//console.log('cek session: '+session);
	usersdb.view('user','cekSession',{keys:[session]},function(err,body){
		if(err){
			console.log(err);
			callback(err);
		}else{
			var result = body.rows;
			if(result.length==0){
				//console.log("session notfound");
				err = 'session not found';
				callback(err);
			}else{
				//console.log("result: %j",result);
				// var last_active = result[0].value;
				// var dateParts = last_active.split("-");
				// var last_log = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
				var last_log = new Date(result[0].value);
				//console.log('last_log: ',last_log);
				var username = result[0].id;
				var now = Date.now();
				//console.log(now-last_log);
				if(now-last_log > 3600000){
					console.log("session timeout for username %s",username);
					callback(null,false,true,username);
				}else{
					//console.log("session true for username: "+username);
					couchdb.updateDb('ipay_users',username,{'updated_at':Date.now()},function(err,body){
						
					});
					callback(null,true,false,username);
				}
			}
		}
	});
	// body...
}
// function updateCouch(username){
// 	var member_db = nano.db.use('ipay_users');
// 	member_db.get(username,function(err,body){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			body["updated_at"]= Date.now();
// 			delete body.rev;
// 			member_db.insert(body,function(err,body){
// 				if(err){
// 					console.log(err);
// 				}else{
// 					console.log("couch users updated");
// 				}
// 			});
// 		}
// 	});
// }
module.exports= session;