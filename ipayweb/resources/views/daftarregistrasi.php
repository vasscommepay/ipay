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
    <script type="text/javascript" src="assets/js/jquery.validate.min.js"></script>
    <script type="text/javascript">
    /*$().ready(function){
        $("#formreg").validate({
                rules: {
                    username: {
                        required: true,
                        minlength: 2
                    },
                    password: {
                        required: true,
                        minlength: 5
                    },
                    confpassword: {
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    },
                    noreg: "required"
                },
                messages: {
                    username: {
                        required: "Masukkan Username"
                        minlength: "Username 3-7 karakter"
                    },
                    password: {
                        required: "Masukkan Password Anda",
                        minlength: "Password anda harus diatas 5 karakter"
                    },
                    confpassword: {
                        required: "Masukkan Password Anda",
                        minlength: "Password anda harus diatas 5 karakter",
                        equalTo: "Password harus sama"
                    },
                    noreg: "Masukkan Nomor Registrasi"
                },
            }
        }*/
    </script>
</head>
<body>
    <div id="login" class="col-md-12 row-centered">
        <div id="loghead" class="col-md-12">
            <span><img src="images/logicon.png" />Silahkan Melakukan Registrasi</span></div>
        <div id="regform" class="col-md-7 col-centered" style="width: 40%">
    <form id="formreg" action="logedin" method="post">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        <div class="form-group">
            <label>Username</label>
                <input type="text" required="" maxlength="7" class="form-control pull-right" name="username" />
        </div>
        <div class="form-group">
            <label>Password</label>
                <input type="password" required="" maxlength="8" class="form-control pull-right" name="password" />
        </div>
        <div class="form-group">
            <label>Confirm Password</label>
                <input type="password" required="" maxlength="8" class="form-control pull-right" name="confpassword" />
        </div><hr />                 
        <div class="form-group">
            <label>Nomor Registrasi</label>
                <input type="text" required="" class="form-control pull-right" name="noreg" />
        </div>                                                      
        <div class="clearfix"></div>
        <button class="btn btn-warning col-md-12" name="submit" onclick="signup()"><i class="glyphicon glyphicon-send"></i> Sign Up</button>
        <hr><label>Sudah punya akun? klik Login</label>
        <a href="login"><button class="btn btn-warning col-md-12" type="button" ><i class="glyphicon glyphicon-send"></i> Login</button></a>   
    </form>                       
        </div>
    </div>
</body>
<script type="text/javascript">
    function signup(){
        var confpassword = ('input[name="confpassword"]');
        var password = ('input[name="password"]');
        if (confpassword.val() != password.val) {
            alert("Password harus sama!");
            confpassword.val();
            confpassword.focus();
        } 
        else {submitregistrasi();}
    }
    function submitregistrasi(){
        $.ajax({
        url:'register',
        type:'POST',
        data: data,
        success: function(res){
            alert(res);}
        });
    }
</script>
</html>