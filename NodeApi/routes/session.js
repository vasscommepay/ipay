
var nano   = require('./nano');
var usersdb = nano.db.use('ipay_users');
var session = function cekSession(session,callback) {
	console.log('cek session: '+session);
	usersdb.view('users','cekSession',{keys:[session]},function(err,body){
		if(err){
			console.log(err);
			callback(err);
		}else{
			var result = body.rows;
			if(result.length==0){
				console.log("session notfound");
				callback(null,false);
			}else{
				var last_log = new Date(result.value);
				var username = result.id;
				var now = Date.now();
				if(now-last_log > 3600000){
					console.log("session timeout");
					callback(null,false,"timeout");
				}else{
					console.log("session true for username: "+username);
					updateCouch(username);
					callback(null,true);
				}
			}
		}
	});
	// body...
}
function updateCouch(username){
	var member_db = nano.db.use('ipay_users');
	member_db.get(username,function(err,body){
		if(err){
			console.log(err);
		}else{
			body["updated_at"]= Date.now();
			delete body.rev;
			member_db.insert(body,function(err,body){
				if(err){
					console.log(err);
				}else{
					console.log("couch users updated");
				}
			});
		}
	});
}
module.exports= session;