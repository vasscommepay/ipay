
var nano   = require('./nano');
var usersdb = nano.db.use('ipay_users');
var session = function cekSession(session,callback) {
	usersdb.view('users','cekSession',{keys:[session]},function(err,body){
		if(err){
			callback(err);
		}else{
			var result = body.rows;
			if(result.length==0){
				callback(null,false);
			}else{
				var last_log = new Date(result.value);
				var now = Date.now();
				if(now-last_log > 3600000){
					console.log("session timeout");
					callback(null,false,"timeout");
				}else{
					console.log("session true");
					callback(null,true);
				}
			}
		}
	});
	// body...
}
module.exports= session;