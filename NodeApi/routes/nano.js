var local_address = 'http://localhost:5984';
var cloud_address = 'https://couchdb-8d8a45.smileupps.com';
var nano   = require('nano')(local_address)
, username = 'admin'
	  , userpass = '8c18747889e9'
	  , callback = console.log // this would normally be some callback
	  , cookies  = {} // store cookies, normally redis or something
	  , secret = 'e9ef7323519d827ad2314085539421';
	  ;

module.exports = nano;