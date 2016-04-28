 var express       = require('express');
 var async         = require('async');
 var routes        = require('routes');
 var http          = require('http');
 var path          = require('path');
 var favicon       = require('serve-favicon');
 var logger        = require('morgan');
 var cookieParser  = require('cookie-parser');
 var bodyParser    = require('body-parser');
 var nodemailer    = require('nodemailer');
 var mailer        = require('express-mailer');
 var mysql         = require('mysql');
 var nano   = require('./routes/nano');
 var transaction_db = nano.db.use('ipay_transaction');
 var routes      = require('./routes/index');
 var login       = require('./routes/login');
 var member      = require('./routes/member');
 var users       = require('./routes/users');
 var produk      = require('./routes/produk');
 var address     = require('./routes/address');
 var saldo       = require('./routes/saldo');
 var transaction = require('./routes/transaction');
 var nonagen     = require('./routes/nonagen');
 var wilayah     = require('./routes/wilayah');
//var kategori    = require('./routes/kategori');
var couch       = require('./routes/couchdb');
var couchdb     = require('./routes/couchdbfunction');
var connection  = require('./routes/db');
var app         = require('express')(),
mailer      = require('express-mailer');
var supplier_db = nano.db.use('ipay_supplier');
var transaction_db = nano.db.use('ipay_transaction');
var produk_db = nano.db.use('ipay_produk'); 
var member_db = nano.db.use('ipay_member');



// view engine setup
app.set('port', process.env.PORT || 5000, '127.0.0.1');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/address',address);
app.use('/login',login);
app.use('/member', member);
app.use('/produk',produk);
app.use('/saldo',saldo);
app.use('/transaction',transaction);
app.use('/users', users);
app.use('/couchdb',couch);
app.use('/nonagen',nonagen);
app.use('/wilayah',wilayah);
//app.use('/kategori',kategori);

app.post('/mail', function(req, res){
  mailer.extend(app,{
    from: req.body.email,
    host:'smtp.gmail.com',
    secureConnection: true,
    port: 465,
    transportMethod: 'SMTP',
    auth: {
     user: 'gallan.widyanto@gmail.com',
     pass: '9oL;dnf21.,'
 }

});
  app.mailer.send('email',{
   to: 'bfibrianto@gmail.com',
   subject: req.body.subject,
   message: req.body.message

}, function(err){
  if(err){
   console.log('error');
       //return;
   }
   res.send('email sent');
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
  });
});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
});
});

cekRespon();

function cekRespon(){
  var responded = false;
  var count = 0;
  async.whilst(
    function(){
      return responded == false;
  }
  ,function(callback){
      count++;
      //console.log('waiting respon ',count);
      transaction_db.view('transaction','new_trans',function(err,body){
            if(err){
            callback(err);
          }else{
              var id_transaksi;
              if(body.total_rows!=0){
                var rows = body.rows;
                var len = body.total_rows;
                var finished_item = 0;
                async.each(rows,function(row,callback){
                      //console.log('rows: %j',row);
                      var id = row.id;
                      id_transaksi = id;
                      var value = row.value;
                      var status_biller = value.status_biller;
                      var jumlah_coba = value.tries;
                      if(status_biller=='sukses'){
                        var id_korwil = value.id_korwil;
                        var id_koor = value.id_koor;
                        var qty = value.order_qty;
                        var id_produk = value.id_produk;
                        setKomisi(id_produk,qty,id_korwil,id_koor,id,function(err,result){
                          if(err){
                            callback(err);
                        }else{
                            console.log("transaction %s success in %S ",id,Date.now());
                            callback();
                        }
                    });
                    }else if(status_biller=='gagal'){
                        createRefund(id,function(err,result){
                          if(err){
                            callback(err);
                        }else{
                            console.log("transaction %s refunded in %s sec",id,Date.now());
                            callback();
                        }
                    });
                    }else{
                        callback();
                    } 
                }
                ,function(err){
                  if(err){
                    console.log(err);
                    setTimeout(callback,3000);
                }else{
                        //console.log('new respon updated');
                        setTimeout(callback,3000);
                    }
                });
            }else{
                setTimeout(callback,3000);;
            }
        }
    });
  }
  ,function(err){
      if(err){
        console.log(err);
    }else{
        console.log('all transaction responded in %s sec',count);
    }
});
}

function setResponded(doc_id,callback){
  couchdb.updateDb('ipay_transaction',doc_id,{'new_trans':false},function(err,body){
    if(err){
      callback(err);
  }else{
      console.log(doc_id,'responded');
      callback(null,true);
  }
});
}

function setKomisi(id_produk,qty,id_korwil,id_koor,id_tran,callback){
  produk_db.get(id_produk,function(err,rows){
    if(err){
      callback(err);
  }else{
      var harga_jual_koor = rows.harga_jual[id_koor];
      var harga_jual_korwil = rows.harga_jual[id_korwil];
      var harga_beli_koor = rows.harga_beli[id_koor];
      var harga_beli_korwil = rows.harga_beli[id_korwil];
      var komisi_koor = (harga_jual_koor - harga_beli_koor)*qty;
      var komisi_korwil = (harga_jual_korwil - harga_beli_korwil)*qty;
      console.log("Komisi korwil %s : %s",id_korwil, komisi_korwil);
      console.log("Komisi koor %s : %s",id_koor, komisi_koor);
      connection.query("CALL komisi_sp("+id_tran+","+komisi_koor+","+komisi_korwil+","+id_koor+","+id_korwil+")",function(err,result){
        if(err){
          callback(id_tran+err);
      }else{
          setResponded(id_tran,function(err,res){

          });
          callback(null,result);
      }
  });
  }
});
}

function createRefund(id_transaksi,callback){
  var query = "CALL refund_sp('"+id_transaksi+"')";

  connection.query(query,function(err,rows){
    if(err){
      callback(id_transaksi+err);
  }else{
      setResponded(id_transaksi,function(err,res){

      });
      callback(null,true);
  }
});
}

function mutasiHarian(){

}

//module.exports = app;

//app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});






