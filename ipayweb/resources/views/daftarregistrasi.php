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
            /*$('#confpassword').keyup(function(){
                var passpertama = $("#password").val();
                var passkedua = $("#confpassword").val();
                if($('#password').val() != $('#confpassword').val()){
                    $('#confpassword').css('background','#e74c3c'); //warna merah
                }else if(passpertama == passkedua){
                    $('#confpassword').css('background','#2ecc71'); //warna hijau
                }
            });*/
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
            <span><img src="images/logicon.png" />Silahkan Melakukan Registrasi</span></div>
        <div id="regform" class="col-md-7 col-centered" style="width: 40%">
    <form id="formreg" method="post">
        <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        <div class="form-group">
            <label>Username</label>
                <input type="text" required="" placeholder="Username" class="form-control pull-right" name="username" onchange="cekUsername()" />
        </div><hr>
        <div class="form-group">
            <label>Password</label>
                <input type="password" required="" placeholder="Password" maxlength="8" class="form-control pull-right" name="password" id="password" />
        </div>
        <div class="form-group">
            <label>Ulangi Password</label>
                <input type="password" required="" placeholder="Ulangi Password" maxlength="8" class="form-control pull-right" name="confpassword" id="confpassword" onchange="cekPassword()" />
        </div><hr />                 
        <div class="form-group">
            <label>Nomor Registrasi</label>
                <input type="text" required="" placeholder="Nomor Registrasi" class="form-control pull-right" name="noreg" />
        </div>
        <div class="form-group">
            <i class="glyphicon glyphicon-refresh"></i> Pertanyaan Keamanan: <br>
            <i class="rand1"></i> + <i class="rand2"></i> = ?
            <input type="text" id="total" name="securitykey" class="form-control pull-right" placeholder="Pertanyaan Keamanan" required autocomplete="off" />
        </div>
        <div class="clearfix"></div>
        <button type="button" class="btn btn-warning col-md-12" name="submit" onclick="signup()"><i class="glyphicon glyphicon-send"></i> Sign Up</button>
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
        var cpassword = $('input[name="confpassword"]').val();
        if(password != cpassword){
            bootbox.alert("password harus sama");
            $('input[name="confpassword"]').val("");
            $('input[name="confpassword"]').focus();
        }
    }
    function signup(){
        var username = $('input[name="username"]');
        var password = $('input[name="password"]');
        var confpassword = $('input[name="confpassword"]');
        var noreg = $('input[name="noreg"]');
        var data = $("#formreg").serialize();
        if (username.val() == "") {
            bootbox.dialog({
              message: "Masukkan Username!",
              title: "Pesan Kesalahan",
              buttons: {
                success: {
                  label: "Close!",
                  className: "btn btn-warning",
                },
              }
            });
             $('input[name="username"]').val("");
            $('input[name="username"]').focus();
        }
        else if (password.val() == "") {
            bootbox.dialog({
              message: "Masukkan Password!",
              title: "Pesan Kesalahan",
              buttons: {
                success: {
                  label: "Close!",
                  className: "btn btn-warning",
                },
              }
            });
             $('input[name="password"]').val("");
            $('input[name="password"]').focus();
        }
        else if (confpassword.val() == "") {
            bootbox.dialog({
              message: "Masukkan Konfirmasi Password!",
              title: "Pesan Kesalahan",
              buttons: {
                success: {
                  label: "Close!",
                  className: "btn btn-warning",
                },
              }
            });
             $('input[name="confpassword"]').val("");
            $('input[name="confpassword"]').focus();
        }
        else if (noreg.val() == "") {
            bootbox.dialog({
              message: "Masukkan Nomor Registrasi!",
              title: "Pesan Kesalahan",
              buttons: {
                success: {
                  label: "Close!",
                  className: "btn btn-warning",
                },
              }
            });
             $('input[name="noreg"]').val("");
            $('input[name="noreg"]').focus();
        }else{



          $.ajax({
              url:'register',
              type: 'POST',
              data: data,
              success: function(res){
                  //alert(res);
                  var hasil = JSON.parse(res);
                  if(!hasil[0].error){
                      bootbox.dialog({
                        message: "User Berhasil ditambahkan, Silahkan Login Dulu",
                        title: "Berhasil",
                        buttons: {
                          success: {
                            label: "Oke",
                            className: "btn btn-success",
                          },
                        }
                      });
                  }else {
                      bootbox.dialog({
                        message: "User Terlalu Banyak",
                        title: "Konfirmasi",
                        buttons: {
                          success: {
                            label: "Oke",
                            className: "btn btn-danger",
                          },
                        }
                      });
                  }
              }
          });
        }
    }
</script>
</html>