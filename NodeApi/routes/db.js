var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '10.0.0.19',
    user     : 'root',
    password : 'S4)CA&kJkLJvEMw<',
    database : 'ipaydb2'
});

connection.connect(function(err) {
    if (err) {
    console.error('error connecting: ' + err.stack);
    return;
}});

module.exports = connection;