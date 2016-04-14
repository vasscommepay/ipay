var async      = require('async');
var nano   = require('./nano');

var updatedb = function(dbname,doc_id,params,callback){
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
						callback();
					}
				}
			});
		}
		],function(err){
			if(err){
				callback(err);
				console.log("Updatedb ERORR: "+err);
			}else{
				//delete oldbody.rev;
				for(keys in params){
					console.log("keys: "+keys);
					console.log("values: "+params[keys]);
					oldbody[keys]=params[keys];
				}
				db.insert(oldbody,function(err,body){
					if(err){
						callback(err);
						console.log("Updatedb ERORR: "+err);
					}else{
						callback(null,body);
					}
				});
			}
		});
}

module.exports = updatedb;