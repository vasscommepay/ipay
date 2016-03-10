var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'ipaydb'
});

/*
 * GET customers listing.
 */
// exports.list = function(req, res){
//   req.getConnection(function(err,connection){
       
//      connection.query('SELECT * FROM member',function(err,rows)     {
            
//         if(err)
//            console.log("Error Selecting : %s ",err );
     
//             //res.render('customers',{page_title:"Customers - Node.js",data:rows});
//             res.json(rows);
//          });
       
//     });
  
// };

// exports.add = function(req, res){
//   res.render('add_customer',{page_title:"Add Customers-Node.js"});
// };

// exports.edit = function(req, res){
    
//   var id = req.params.id;
    
//   req.getConnection(function(err,connection){
       
//      connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
//         {
            
//             if(err)
//                 console.log("Error Selecting : %s ",err );
     
//             res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
                           
//          });
                 
//     }); 
// };
// /*Save the customer*/
// exports.save = function(req,res){
    
//     var input = JSON.parse(JSON.stringify(req.body));
    
//     req.getConnection(function (err, connection) {
        
//         var data = {
            
//             name    : input.name,
//             address : input.address,
//             email   : input.email,
//             phone   : input.phone 
        
//         };
        
//         var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
//         {
  
//           if (err)
//               console.log("Error inserting : %s ",err );
         
//           res.redirect('/customers');
          
//         });
        
//        // console.log(query.sql); get raw query
    
//     });
// };/*Save edited customer*/
// exports.save_edit = function(req,res){
    
//     var input = JSON.parse(JSON.stringify(req.body));
//     var id = req.params.id;
    
//     req.getConnection(function (err, connection) {
        
//         var data = {
            
//             name    : input.name,
//             address : input.address,
//             email   : input.email,
//             phone   : input.phone 
        
//         };
        
//         connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
//         {
  
//           if (err)
//               console.log("Error Updating : %s ",err );
         
//           res.redirect('/customers');
          
//         });
    
//     });
// };

// exports.delete_customer = function(req,res){
          
//      var id = req.params.id;
    
//      req.getConnection(function (err, connection) {
        
//         connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
//         {
            
//              if(err)
//                  console.log("Error deleting : %s ",err );
            
//              res.redirect('/customers');
             
//         });
        
//      });
// };



// var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// connection.connect(function(err){
// 	if(!err) {
// 	 console.log("Database is connected ... \n\n");  
// 	} else {
// 	 console.log("Error connecting database ... \n\n");  
// 	}
// });

router.get("/",function(req,res,next){
//var get_member = {sql : 'SELECT * from member'}

connection.query('SELECT * from users', function(err, rows, fields) {
		if (err){
		   console.log(err);
		}else{
			res.json(rows);
		}
	});
});

//router.post("/member/:id",function(req,res,next){
//res.send('ambil id');
//var post_id_member = {sql : 'SELECT * from member where id_member ="'+req.body.id_member+'"'}

// connection.query('SELECT * from member where id_member ="'+req.body.id_member+'"', function(err, rows, fields) {
// 		if (err){
// 		   console.log(err);
// 		}else{
// 			//console.log(rows)
// 			res.json(rows);
// 		}
// 	});
//});

//app.listen(3000);
module.exports = router;