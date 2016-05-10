var mysql      = require('mysql');
var connection = mysql.createConnection({
    //host   :'127.0.0.1',
    host     : '10.0.0.19',   
    user     : 'root',
    //password:'',
    password : 'S4)CA&kJkLJvEMw<',
    database : 'ipaydb2',
    multipleStatements: true
});
// createPool({
//         connectionLimit : 100,
//         waitForConnections : true,
//         queueLimit :0,
//         host     : '10.0.0.19',
//         user     : 'root',
//         password : 'S4)CA&kJkLJvEMw<',
//         database : 'ipaydb2',
//         debug    :  true,
//         wait_timeout : 28800,
//         connect_timeout :10
//     });
// // 

connection.connect(function(err) {
    if (err) {
    console.error('error connecting: ' + err.stack);
    return;
}});

module.exports = connection;