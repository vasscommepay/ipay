<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="csrf-token" content="<?php echo csrf_token(); ?>">
<title>Vascomm - Value Added Service & Community</title>
</head>
   	<link rel="shortcut icon" href="images/favicon.png"/>
	<link rel="icon" sizes="16x16 32x32 64x64" href="images/favicon.png"/>
<link href="bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet" type="text/css">
<link href="bootstrap-3.3.5-dist/css/bootstrap-theme.css" rel="stylesheet" type="text/css">
<link href="css/media.css" rel="stylesheet" type="text/css">
<link href="css/style.css" rel="stylesheet" type="text/css">
<link href="css/mainslider.css" rel="stylesheet" type="text/css">
<link href="css/demo-styles.css" rel="stylesheet" type="text/css">
<link href="css/transaction.css" rel="stylesheet" type="text/css">
<link href="css/tilestyle.css" rel="stylesheet" type="text/css">
<link href="css/tiling.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="js/bootstrap.js"></script>
<script type="text/javascript" src="js/smoothPageScroll.js"></script>
<script type="text/javascript" src="js/tilescript.js"></script>
<script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
	$(".cartmodal").click(function(){
        $("#carts").modal();
    });
	$(".loginmodal").click(function(){
        $("#login").modal();
    });
	$(".signupmodal").click(function(){
        $("#signup").modal();
    });
  $('#chckout').click(function(){
        $('#midform').load('pages/checkout.html');
      });

//scroll samping kategori 
  var updateRightLeftButtonskategori = function() {
    //if (306 > (parseInt($('#categorymenu ul').css('marginLeft')) * -1)) {
    if ((($('#categorymenu ul').width() * $('#categorymenu ul').length) + 500) < (parseInt($('#categorymenu ul').css('marginLeft')) * -1)) {
        $('.left-button1').hide();
    } else {
        $('.left-button1').show();
    }
    if ((($('#categorymenu ul').width() * $('#categorymenu ul').length) - 500) < (parseInt($('#categorymenu ul').css('marginLeft')) * -1)) {
        $('.right-button1').hide();
    } else {
        $('.right-button1').show();
    }
  };
  updateRightLeftButtonskategori();
  $('.right-button1').click(function() {
      updateRightLeftButtonskategori();
      if ($(this).is(':visible'))
      $('#categorymenu ul').animate({
          marginLeft: "-=306px"
      }, "fast", updateRightLeftButtonskategori);
  });
  $('.left-button1').click(function() {
      updateRightLeftButtonskategori();
      if ($(this).is(':visible'))
      $('#categorymenu ul').animate({
          marginLeft: "+=306px"
      }, "fast", updateRightLeftButtonskategori);
  });
     
  //scroll samping subkategori
  var updateRightLeftButtons = function() {
      if (306 > (parseInt($('#category_list ul').css('marginLeft')) * -1)) {
          $('.left-button').hide();
      } else {
          $('.left-button').show();
      }
      if ((($('#category_list ul').width() * $('#category_list ul').length) - 500) < (parseInt($('#category_list ul').css('marginLeft')) * -1)) {
          $('.right-button').hide();
      } else {
          $('.right-button').show();
      }
  };
  updateRightLeftButtons();
  $('.right-button').click(function() {
      updateRightLeftButtons();
      if ($(this).is(':visible'))
      $('#category_list ul').animate({
          marginLeft: "-=306px"
      }, "fast", updateRightLeftButtons);
  });
  $('.left-button').click(function() {
      updateRightLeftButtons();
      if ($(this).is(':visible'))
      $('#category_list ul').animate({
          marginLeft: "+=306px"
      }, "fast", updateRightLeftButtons);
  });


var clicked=true;
$("#minimenu").on('click', function(){
    if(clicked)
    {
        clicked=false;
        $(".hiddenmenu").css({"left":0});
    }
    else
    {
        clicked=true;
        $(".hiddenmenu").css({"left": "-110vw"});
    }
});
$("#closebutton").on('click', function(){
    if(clicked)
    {
        clicked=false;
        $(".hiddenmenu").css({"left":"-110vw"});
    }
    else
    {
        clicked=true;
        $(".hiddenmenu").css({"left": 0});
    }
});
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

  /*var lv = $("#level_member").val();
    if(lv==0){
     
    }*/

  $.ajax({
    url:'kategori',
    type: 'POST',
    success: function(res){
      var kategori = JSON.parse(res);
      $.each(kategori, function(key, val){
        var idkat = val.id_kategori;
        var namakat = val.nama_kategori;
        $("#allCategory").append('<a href="#generalcat"><div id="category" class="bullet greymenu tile slideTextRight" onclick="tampilSubKat(&#39'+idkat+'&#39)"><div><p>'+idkat+'</p></div><div><p><img src="images/'+namakat+'.png" /></p></div></div></a>');
      });
    }
  });
});
   
</script>
</head>
<body>
<!--<input type="hidden" value="<?PHP //echo Session::get('username', "ipay"); ?>" id="level_member">-->
<div id="slide1top" class="col-md-12 col-sm col-xs-12 shd wbg">
<a href="index"><div id="mainlogo" class="col-md-2 col-sm-2 col-xs-5"><img src="images/ipaylogo.png" class="trs"></div></a>

<div id="shopping_cart" class="col-md-2 col-sm-2 col-xs-2 col-md-offset-3 row-centered">
<a href="#" class="cartmodal trs"><div class="col-md-3 col-sm-3 col-xs-4"><img class="trs" src="images/shopcart_icon.png" class="trs"></div>
<div id="jmlhcart"><div class="col-md-3 col-sm-3 col-xs-3"><p  class="trs">000</p></div></div></a></div>

<div id="logocart" style="display: none"><div id="shopping_cart" class="col-md-2 col-sm-2 col-xs-2 col-md-offset-3 row-centered">
<div class="col-md-3 col-sm-3 col-xs-4"><img class="trs" src="images/shopcart_icon.png" class="trs"></div>
<div class="col-md-3 col-sm-3 col-xs-3"><p  class="trs">PEMBAYARAN</p></div></div></div>

<div id="minimenu" class="col-xs-1 pull-right visible-xs"><i class="glyphicon glyphicon-option-vertical"></i></div>
<div class="hiddenmenu col-xs-12 visible-xs softtrs softshd">
<div id="closebutton"><i class="glyphicon glyphicon-remove-circle"></i></div>
<h2 class="row-centered">MAIN MENU</h2>
<div id="minimainmenu" class="col-xs-12 row-centered">
 <ul class="navbar-nav">
              <li class="col-centered active"><a href="#" class="ipay trs">ABOUT<span class="sr-only">(current)</span></a></li>
              <li class="col-centered"><a href="#" class="ipaystore trs">IPAYSTORE</a></li>
        <li class="col-centered"><a href="#" class="afiliasi trs">AFILIASI</a></li>
              <li class="col-centered"><a href="#slide3" class="trs">CONTACT</a></li>
              <li class="col-centered"><a href="#" class="trs">BLOG</a></li>
            </ul>
</div>
<div id="hiddennav" class="col-xs-12 row-centered hidbg">
<h4 class="row-centered">Navigation</h4>
<div id="mininav" class="col-xs-12 row-centered">
 <ul class="navbar-nav">
              <li class="active"><a href="#slide1" class="trs">HOMEPAGE<span class="sr-only">(current)</span></a></li>
              <li><a href="#slide2" class="trs">LAYANAN IPAY </a></li>
              <li><a href="#slide3" class="trs">CONTACT</a></li>
            </ul>
</div>
<ul id="maintile" class="tiles col-md-12 col-xs-12">
<div class="row">
<li class="col-xs-12"><div class="tile tile-trans rotate3d rotate3dY metro-tile ">
<div class="faces">
<div class="front tile-gray"><p class="tile-parmed">Transaksi<br />Sekarang</p></div>
<div class="back tile-green iconpic centering"><img src="images/cashiericon.png" /></div>
</div></div></li>
</div>
<div class="row">
<li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile ">
<div class="faces">
<div class="front tile-darkore iconpic centering"><img src="images/regicon.png" /></div>
<a href="#" class="signupmodal"><div class="back tile-orange"><p class="tile-parmed">Daftar Member</p></div></a>
</div></div></li>
<li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile ">
<div class="faces">
<div class="front tile-blue iconpic centering"><img src="images/logicon.png" /></div>
<a href="#" class="loginmodal"><div class="back tile-deepblue"><p class="tile-parmed">Login</p></div></a>
</div></div></li>
</div>
</ul>

</div>
<div id="minisocmed" class="col-xs-5 row-centered">
 <ul class="nav navbar-nav">
              <li><a href="#company"><img src="images/facebookicon.png" class="trs"></a></li>
              <li><a href="#works"><img src="images/twittericon.png" class="trs"></a></li>
              <li><a href="#clients"><img src="images/youtubeicon.png" class="trs"></a></li>
              <li><a href="#team"><img src="images/gplusicon.png" class="trs"></a></li>
              <li><a href="#joinus"><img src="images/linkedin.png" class="trs"></a></li>
            </ul>
</div>
<div id="menucopyright" class="col-xs-12 row-centered" style="margin-top:0;">&copy; iPay Copyright 2016</div>
</div>

<div id="mainmenu" class="col-md-3 col-sm-3 hidden-xs pull-right">
 <ul class="navbar-nav">
              <li class="active"><a href="#" class="loginmodal trs">Login<span class="sr-only">(current)</span></a></li>
              <li class="quicktrans"><a href="#" class="signupmodal trs">
			  <div class="tile tile-trans rotate3d rotate3dY metro-tile centering">
			  <div class="faces">
			  <div class="front tile-darkore"><p class="tile-parsmall centersmall">Signup</p></div>
			  <div class="back tile-orange iconpic centering"><img src="images/regicon.png" /></div>
				</div></div></a></li>
            </ul>
</div></div>

<div id="kategori_list" class="col-md-12 col-sm-12 col-xs-12 row-centered">
<div id="transaction_category" class="col-md-12 col-sm-12 col-xs-12 row-centered">
  <h2 class="pull-left">CATEGORY</h2>
    <div id="categorymenu" class="col-md-7 col-sm-7 col-xs-7 col-centered">
      <a href="#generalcat"><div id="category" class="col-md-3 col-sm-3 col-xs-3 bullet tile slideTextRight greymenu col-centered">
        <div><p>GENERAL</p></div>
        <div><p><img src="images/walleticon.png" /></p></div>
      </div></a>
    </div>
      <a class="left-button1"><i class="glyphicon glyphicon-chevron-left"></i></a>
      <a class="right-button1"><i class="glyphicon glyphicon-chevron-right"></i></a>
</div>
</div>

<div id="product_list" class="col-md-12 col-sm-12 col-xs-12 row-centered">
  <div id="generalcat" class="col-md-12 col-xs-12 trs scrollcat">
  <h2 class="pull-left">PRODUCTS</h2>
    <div id="category_list" class="col-7 col-sm-7 col-xs-7 scrollcat col-centered">
      <ul>
        <li><a href="#aform"><div id="category" class="bullet whitemenu tile slideTextRight">
          <div><p>KartuHALO</p></div>
          <div><p><img src="images/haloicon.png" /></p></div>
        </div></a></li>
      </ul>
    </div>
    <a class="left-button"><i class="glyphicon glyphicon-chevron-left"></i></a>
    <a class="right-button"><i class="glyphicon glyphicon-chevron-right"></i></a>
    <a href="#" class="close-button"><i class="glyphicon glyphicon-remove"></i></a>
  </div>
</div>

<div class="col-md-12 col-md-12 col-xs-12 row-centered">
<div id="midform" class="col-md-7 col-sm-7 col-xs-7 col-centered">
<div id="defsurface" class="col-md-12 col-xs-12 col-centered">
<div class="row-centered"><i class="glyphicon glyphicon-th"></i></div>
<div class="row-centered"><p class="col-md-5 col-sm-5 col-xs-5 col-centered">Pilih Kategori dan Produk untuk memulai pembayaran.</p></div>
</div>
<div id="aform" class="col-md-12 col-xs-12 col-centered">
<h2>PEMBAYARAN -NAMA PRODUK-</h2>
<form class="form-horizontal">
<div class="form-group">
<label class="col-md-5 col-xs-12 control-label">Jenis provider</label><input type="text" class="col-md-7 col-sm-7 col-xs-12" /></div>
<div class="form-group">
<label class="col-md-5 col-xs-12 control-label">No. HP</label><input type="text" class="col-md-7 col-sm-7 col-xs-12" /></div>
<div class="form-group">
<label class="col-md-5 col-xs-12 control-label">Pilih Nominal</label><input type="text" class="col-md-7 col-sm-7 col-xs-12" /></div>
<div class="form-group">
<label class="col-md-5 col-xs-12 control-label">Tanggal Transaksi</label><input type="text" class="col-md-7 col-sm-7 col-xs-12" /></div>
<div class="form-group">
<button type="submit" class="pull-right col-md-3"><i class="glyphicon glyphicon-saved"></i>Simpan</button></div>
</form>
</div>
</div>
</div>

 <!-- MODAL CART -->
    <div class="modal fade" id="carts" role="dialog">
      <div class="modal-dialog"> 
        
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <img class="carticon2" src="images/carticon2.png" /><span class="cartmodalheadtext">List Pembayaran</span>
          </div>

<div id="stepwrappmain" class="col-md-12">

<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-sm-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-sm-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span class="delcheck col-md-1 col-sm-1 col-xs-1 col-centered"><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-sm-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-sm-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span class="delcheck col-md-1 col-sm-1 col-xs-1 col-centered"><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-sm-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-sm-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span class="delcheck col-md-1 col-sm-1 col-xs-1 col-centered"><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-sm-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-sm-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span class="delcheck col-md-1 col-sm-1 col-xs-1 col-centered"><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-sm-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-sm-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span class="delcheck col-md-1 col-sm-1 col-xs-1 col-centered"><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>

</div>

          <div class="modal-footer">
            <p><a id="chckout" class="close" data-dismiss="modal" href="#"><img src="images/finishbutton.png"  />Checkout</a></p>
          </div>
        </div>
      </div>
    </div>
	
<!-- MODAL LOGIN -->
<div class="modal fade" id="login" role="dialog">
  <div class="modal-dialog">       

    <div class="modal-content row-centered">
      <div class="modal-header">
        <div id="loghead" class="col-md-12"><span><img src="images/logicon.png" />Silahkan Login</span></div>
      </div>
      <div id="logform" class="col-md-7 col-sm-7 col-xs-10 col-centered">
        <form action="logedin" id="formlogin" method="post">
          <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>" />
          <div id="alertsuccess" class="alert alert-success col-xs-12 col-md-12 row-centered" style="display: none">Info Berhasil</div>   
          <div class="form-group">
            <label>Username</label>
            <input type="text" required="" class="form-control pull-right" name="username" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" required="" class="form-control pull-right" name="password" />
          </div><hr />
          <div class="form-group">
            <i class="glyphicon glyphicon-refresh"></i> Pertanyaan Keamanan: <br>
            <i class="rand1"></i> + <i class="rand2"></i> = ?
            <input type="text" id="total" name="securitykey" class="form-control pull-right" placeholder="Pertanyaan Keamanan" required autocomplete="off" >
          </div>
          <div class="clearfix"></div>
            <button id="logbutton" class="btn btn-warning col-md-12" name="submit" onclick="cekLogin()"><i class="glyphicon glyphicon-send"></i> Login</button>
        </form>                       
      </div>
    </div>
  </div>
</div>

<!-- MODAL SIGNUP -->
<<div class="modal fade" id="signup" role="dialog">
  <div class="modal-dialog"> 
  
    <div class="modal-content row-centered">
      <div class="modal-header">
        <div id="rghead" class="col-md-12 row-centered "><span><img src="images/regicon.png" />Isikan Data Diri Anda</span></div>
      </div>
      <div id="regform" class="col-md-7 col-sm-10 col-xs-10 col-centered">
        <form id="formreg" method="post">
          <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>"/>
          <div id="alertsuccess" class="alert alert-success col-xs-12 col-md-12 row-centered" style="display: none">Info Berhasil</div>      
            <div class="form-group">
              <label>Username</label>
              <input type="text" required="" placeholder="Username" id="susername" class="form-control pull-right" name="susername" onchange="cekUsername()" />
            </div><hr>
          <div class="form-group">
            <label>Password</label>
            <input type="password" required="" placeholder="Password" maxlength="8" class="form-control pull-right" name="spassword" id="spassword" />
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
          <button class="btn btn-warning col-md-12" name="submit" onclick="signup()"><i class="glyphicon glyphicon-send"></i> Register</button>
        </form>                       
      </div>
    </div>
  </div>
</div>
	</body>
<script type="text/javascript">
    function tampilSubKat(id_kategori){
        $.ajax({
            url:'subKategori',
            type: 'POST',
            data: {'idsubkat': id_kategori},
            success: function(res){
                //alert(res);
                var subkategori = JSON.parse(res);
                $("#allSubCategory").html("");
                $.each(subkategori, function(key, val){
                    var idsub = val.id_kategori;
                    var namasub = val.nama_kategori;
                    var subkat = val.id_super_kategori;
                    $("#allSubCategory").append('<li><a href="#aform"><div id="general" class="bullet whitemenu tile slideTextRight" onclick="isiform(&#39'+idsub+'&#39)"><div><p>'+namasub+'</p></div><div><p><img src="images/'+namasub+'.png" /></div></div></a></li>');
                });
            }
        });
    }

     function isiform(id_kategori){
        $.ajax({
            url:'form',
            type: 'POST',
            data: {'idkat': id_kategori},
            success: function(res){
                alert(res);
                var aform = JSON.parse(res);
                $("#formproduk").html("");
                $.each(aform, function(key, val){
                   // var idkategori = val.id_kategori;
                    var inputname = val.input_name;
                    var inputtype = val.input_type;
                    var inputlabel = val.input_label;
                    $("#formproduk").append('<div class="form-group"><label class="col-md-5 control-label">'+inputlabel+'</label><input type="'+inputtype+'" class="col-md-7" /></div>');
                });
            }
        });
    }

    function tampilNominal(product_id){
        $.post('produk',{'idproduk': product_id},function(success){
            var list_produk = JSON.parse(success);
            $("#produk_list").html("");
            $.each(list_produk,function(key,val){
                var idpro = val.product_id;
                $("#produk_list").append('<option value="'+idpro+'">'+idpro+'</option>');
            });
        });
    }
</script>
</html>