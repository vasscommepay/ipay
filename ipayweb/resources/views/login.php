<html>
<head>
    <link href="bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link href="bootstrap-3.3.5-dist/css/bootstrap-theme.css" rel="stylesheet" type="text/css">
    <link href="css/styles.css" rel="stylesheet" type="text/css">
	<link href="css/global.css" rel="stylesheet" type="text/css">
    <link href="css/jquery.realperson.css" rel="stylesheet" type="text/css" > 
    <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="bootstrap-3.3.5-dist/js/bootstrap.js"></script>
    <script type="text/javascript" src="js/bootstrap-carousel.js"></script>     
    <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
    <script type="text/javascript" src="js/jquery.plugin.js"></script> 
    <script type="text/javascript" src="js/jquery.realperson.min.js"></script>
    <script type="text/javascript" src="js/bootbox.min.js"></script>
    <script type="text/javascript">
    /*$(function(){
        $('#defaultReal').realperson();
    });*/
    $(document).ready(function () {
        $("#logbutton").click(function(){
            var total=parseInt($('.rand1').html())+parseInt($('.rand2').html());
            var total1=$('#total').val();
            if (total!=total1) {
                bootbox.dialog({
                  message: "Wrong Calculation Entered",
                  title: "Pesan Kesalahan",
                  buttons: {
                    success: {
                      label: "Close!",
                      className: "btn btn-warning",
                    },
                  }
                });
                randomnum();
                return false;
            } 
        });
        randomnum();

        function randomnum() { //utk mengubah angka
            var number1 = 3;
            var number2 = 10;
            var randomnum = (parseInt(number2) - parseInt(number1)) + 1;
            var rand1 = Math.floor(Math.random()*randomnum)+parseInt(number1);
            var rand2 = Math.floor(Math.random()*randomnum)+parseInt(number1);
            $(".rand1").html(rand1);//rand1 adalah class untuk nomor pertama
            $(".rand2").html(rand2);//rand2 adalah class untuk nomor kedua
        }
    });
    </script>
</head>
<body>
    <div id="login" class="col-md-12 row-centered">
        <div id="loghead" class="col-md-12">
            <img src="images/ipaylogo.png" />
			<h1>Member Login</h1></div>
        <div id="regform" class="col-md-7 col-centered" style="width: 40%">
    <form action="logedin" id="formlogin" method="post">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        <div class="form-group">
            <label>Username</label>
                <input type="text" required="" placeholder="Masukkan Username Anda" class="form-control pull-right" name="username" />
        </div>
        <div class="form-group">
            <label>Password</label>
                <input type="password" required="" placeholder="Masukkan Password" class="form-control pull-right" name="password" />
        </div><hr />           
        <div class="form-group">
            <i class="glyphicon glyphicon-refresh"></i> Pertanyaan Keamanan: <br>
            <div class="row row-centered"><i class="rand1"></i> + <i class="rand2"></i> = ?</div>
            <input type="text" id="total" name="securitykey" class="form-control pull-right" placeholder="Pertanyaan Keamanan" required autocomplete="off" >
        </div>
        <div class="clearfix"></div>
		<div class="form-group">
        <button id="loginbutton" class="btn col-md-5 col-sm-5 col-xs-5 trs" name="submit" onclick=""><i class="glyphicon glyphicon-send"></i> Login</button>
        <a href="daftarregistrasi"><button class="btn regbtn col-md-5 col-sm-5 col-xs-5 trs" type="button"><i class="glyphicon glyphicon-pencil"></i> Register</button></a>
		</div>
    </form>                       
        </div>
    </div>
</body>
<script type="text/javascript">
    function cekLogin(){
        var data = $("#formlogin").serialize();
        $.ajax({
            url:'logedin',
            type: 'POST',
            data: data,
            success: function(res){
                var result = JSON.parse(res);
                //alert(result.status);
                if (result.status){
                    bootbox.alert("username tidak bisa digunakan");
                }
            }
        });
    }
</script>
</html>