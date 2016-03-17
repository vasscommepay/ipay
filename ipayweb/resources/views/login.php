<html>
<head>
    <link href="bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="bootstrap-3.3.5-dist/css/bootstrap-theme.css" rel="stylesheet" type="text/css">
    <link href="css/styles.css" rel="stylesheet" type="text/css">
    <link href="css/demo-styles.css" rel="stylesheet" type="text/css">
    <link href="css/tilestyle.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="bootstrap-3.3.5-dist/js/bootstrap.js"></script>
    <script type="text/javascript" src="js/bootstrap-carousel.js"></script>     
    <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
</head>
<body>
    <div id="login" class="col-md-12 row-centered">
        <div id="loghead" class="col-md-12">
            <span><img src="images/logicon.png" />Silahkan Login</span></div>
        <div id="regform" class="col-md-7 col-centered">
    <form action="logedin" method="post">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        <div class="form-group">
            <label>Username</label>
                <input type="text" required="" class="form-control pull-right" name="username" />
        </div>
        <div class="form-group">
            <label>Password</label>
                <input type="password" required="" class="form-control pull-right" name="password" />
        </div><hr />                 
        <div class="form-group">
            <label>Captcha</label>
                <input type="text" required="" class="form-control pull-right" name="Captcha" />
        </div>                                                      
        <div class="clearfix"></div>
        <button class="btn btn-warning col-md-12" name="submit"><i class="glyphicon glyphicon-send"></i> Register</button>
    </form>                       
        </div>
    </div>
</body>
</html>