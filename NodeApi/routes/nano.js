var nano   = require('nano')('https://couchdb-8d8a45.smileupps.com')
, username = 'admin'
	  , userpass = '8c18747889e9'
	  , callback = console.log // this would normally be some callback
	  , cookies  = {} // store cookies, normally redis or something
	  ;

module.exports = nano;