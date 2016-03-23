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
// var connection = mysql.createConnection({
//    host     : 'localhost',
//    user     : 'root',
//    password : '',
//    database : 'ipaydb'
// });

var routes      = require('./routes/index');
var login       = require('./routes/login');
var member      = require('./routes/member');
var users       = require('./routes/users');
var produk      = require('./routes/produk');
var address     = require('./routes/address');
var saldo       = require('./routes/saldo');
var transaction = require('./routes/transaction');
var app         = require('express')(),
    mailer      = require('express-mailer');

// view engine setup
app.set('port', process.env.PORT || 5000, '11.0.0.39');
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


//module.exports = app;

//app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

