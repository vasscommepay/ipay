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
    <script type="text/javascript" src="js/bootbox.min.js"></script>
    <script type="text/javascript" src="js/jquery.validate.js"></script>
    <script type="text/javascript">
    $(document).ready(function(){
        $('#confpassword').keyup(function(){
            var passpertama = $("#password").val();
            var passkedua = $("#confpassword").val();
            if($('#password').val() != $('#confpassword').val()){
                $('#confpassword').css('background','#e74c3c'); //warna merah
            }else if(passpertama == passkedua){
                $('#confpassword').css('background','#2ecc71'); //warna hijau
            }
        });             
    });
    /*$(document).ready(function() {
        $('#formreg').validate({
            rules: {
                confpassword: {
                    equalTo: "#password"
                }
            },
            messages: {
                confpassword: {
                    equalTo: "Password tidak sama"
                }
            }
        });
    });*/
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
                <input type="text" required="" class="form-control pull-right" name="username" onchange="cekUsername()" />
        </div><hr>
        <div class="form-group">
            <label>Password</label>
                <input type="password" required="" maxlength="8" class="form-control pull-right" name="password" id="password" />
        </div>
        <div class="form-group">
            <label>Ulangi Password</label>
                <input type="password" required="" maxlength="8" class="form-control pull-right" name="confpassword" id="confpassword" />
        </div><hr />                 
        <div class="form-group">
            <label>Nomor Registrasi</label>
                <input type="text" required="" class="form-control pull-right" name="noreg" />
        </div>                                                      
        <div class="clearfix"></div>
        <button class="btn btn-warning col-md-12" name="submit" onclick="signup()"><i class="glyphicon glyphicon-send"></i> Sign Up</button>
        <label>Sudah punya akun? klik <a href="login"> Login</a></label>
    </form>                       
        </div>
    </div>
</body>
<script type="text/javascript">
    function cekUsername(){
        var data = $('input[name="username"]').val();
        $.ajax({
            url:'cekUsername',
            type: 'POST',
            data: {"username": data},
            success: function(res){
                var result = JSON.parse(res);
                //alert(result.status);
                if (result.status){
                    bootbox.alert("username tidak bisa digunakan");
                    $('input[name="username"]').val("");
                    $('input[name="username"]').focus();
                }
            }
        });
    }
    function cekPassword(){
        var password = $('input[name="password"]').val();
        var confpassword = $('input[name="confpassword"]').val();
        if (password.val() == "a") {
            alert("hayo");
        };
    }
    function signup(){
        var data = $("#formreg").serialize();
        $.ajax({
            url:'register',
            type: 'POST',
            data: data,
            success: function(res){
                alert("sukses");
            }
        });
    }
</script>
</html>