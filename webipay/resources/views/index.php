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
<link href="css/tilestyle.css" rel="stylesheet" type="text/css">
<link href="css/tiling.css" rel="stylesheet" type="text/css">
<link href="css/jquery.dataTables.min.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="js/bootstrap.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/ScrollToPlugin.min.js"></script>
<script type="text/javascript" src="js/smoothPageScroll.js"></script>
<script type="text/javascript" src="js/tilescript.js"></script>
<script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
<script type="text/javascript" src="js/bootbox.min.js"></script>
<script type="text/javascript" src="js/jquery.printelement.min.js"></script>
<script type="text/javascript" src="js/datatables.min.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="js/jquery.validate.min.js"></script>
<script type="text/javascript" src="js/jquery.printelement.min.js"></script>
<script>
$(document).ready(function(){
  $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };
  $.ajax({
        url:'getCart',
        type:'get',
        success:function(result){
          //alert(result);
          var cart = JSON.parse(result);
          var count = Object.size(cart);
          $('#cart-count').html(count);
        }
      });

  /*$(".loginmodal").click(function(){
        $("#login").modal();
    });
  $(".signupmodal").click(function(){
        $("#signup").modal();
    });*/
  
var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);
 
  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);
 
    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
        (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
}

    $('.ipay').click(function(){
        $('#mainslider').load('pages/ipay_page.html');
       });
     $('.ipaystore').click(function(){
        $('#mainslider').load('pages/ipaystore_page.html');
       });
     $('.afiliasi').click(function(){
        $('#mainslider').load('pages/affiliation_page.html');
       });
     $('.daftar_trans').click(function(){
        $('#mainslider').load('pages/daftar_trans.html');
       });
     
     $("#mainslider").load("pages/home.html"); 
      // Cache the Window object
      $window = $(window);

      $("#transnow").click(function(){
        $('#mainslider').load('pages/transaction_page.html');
      });
      $("#transnow1").click(function(){
        $('#mainslider').load('pages/transaction_page.html');
      });

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');

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
                  message: "Masukkan Hitungan yang Benar",
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
  
        "use strict";
    $(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
  }
  });
});

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

// polyfill
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 5000 / 100);
          };
})();
</script>
<body class="loaded">
<!--<input type="hidden" value="<?PHP //echo Session::get('level'); ?>" id="level_member"> -->
  <div id="cont" class="col-md-12 col-xs-12 container">
  <!--header-->
    <div id="slide1" class="sct_1 container-fluid" >
      <div id="slide1top" class="col-md-12 col-sm col-xs-12 shd wbg">
        <a href=""><div id="mainlogo" class="col-md-2 col-sm-2 col-xs-5"><img src="images/ipaylogo.png" class="trs"></div></a>

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

<?php 
  if (Session::get('session') == null){
    echo '<input type="hidden" value="';
    echo Session::get('level'); 
    echo '" id="level_nonmember" />';
    echo '<ul id="maintile" class="tiles col-md-12 col-xs-12"><div class="row">';
    echo '<li id="transnow1" class="col-xs-12"><div class="tile tile-trans rotate3d rotate3dY metro-tile "><div class="faces">';
    echo '<div class="front tile-gray"><p class="tile-parmed">Transaksi<br />Sekarang</p></div>';
    echo '<div class="back tile-green iconpic centering"><img src="images/cashiericon.png" /></div></div></div></li></div>';
    echo '<div class="row"><li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile ">';
    echo '<div class="faces"><div class="front tile-darkore iconpic centering"><img src="images/regicon.png" /></div>';
    echo '<a href="#" class="signupmodal"><div class="back tile-orange"><p class="tile-parmed">Signup</p></div></a>';
    echo '</div></div></li><li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile "><div class="faces">';
    echo '<div class="front tile-blue iconpic centering"><img src="images/logicon.png" /></div>';
    echo '<a href="#" class="loginmodal"><div class="back tile-deepblue"><p class="tile-parmed">Login</p></div></a></div></div></li></div></ul>';
  }
  /*else{
    echo '<input type="hidden" value="';
    echo Session::get('level'); 
    echo '" id="level_member" />';
    echo '<ul id="maintile" class="tiles col-md-12 col-xs-12"><div class="row">';
    echo '<li id="transnow1" class="col-xs-12"><div class="tile tile-trans rotate3d rotate3dY metro-tile "><div class="faces">';
    echo '<div class="front tile-gray"><p class="tile-parmed">Transaksi<br />Sekarang</p></div>';
    echo '<div class="back tile-green iconpic centering"><img src="images/cashiericon.png" /></div></div></div></li></div>';
    echo '<div class="row"><li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile ">';
    echo '<div class="faces"><div class="front tile-darkore iconpic centering"><img src="images/regicon.png" /></div>';
    echo '<a href="#" class="signupmodal"><div class="back tile-orange"><p class="tile-parmed">Daftar Member</p></div></a>';
    echo '</div></div></li><li class="col-xs-6"><div class="tile tile-trans rotate3d rotate3dY metro-tile "><div class="faces">';
    echo '<div class="front tile-blue iconpic centering"><img src="images/logicon.png" /></div>';
    echo '<a href="logout" class="logoutmodal trs"><div class="back tile-deepblue"><p class="tile-parmed">Logout</p></div></a></div></div></li></div></ul>';
  }*/
?>

<!--<ul id="maintile" class="tiles col-md-12 col-xs-12">
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
</ul>-->

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


<div id="mainmenu" class="col-md-8 col-sm-9 hidden-xs pull-right">
  <div style="display: none" id="shopping_cart" onclick="showCart()" class="col-md-2 col-sm-2 col-xs-2 col-md-offset-3 row-centered">
  <a href="#" class="cartmodal trs"><div class="col-md-3 col-sm-3 col-xs-4"><img class="trs" src="images/shopcart_icon.png" class="trs"></div>
  <div class="col-md-3 col-sm-3 col-xs-3"><p id="cart-count" class="trs">0</p></div></a></div>

  <div id="logocart" style="display: none"><div id="shopping_cart" class="col-md-2 col-sm-2 col-xs-2 col-md-offset-3 row-centered">
  <div class="col-md-3 col-sm-3 col-xs-4"><img class="trs" src="images/shopcart_icon.png" class="trs"></div>
  <div class="col-md-3 col-sm-3 col-xs-3"><p  class="trs">PEMBAYARAN</p></div></div></div>

 <ul class="navbar-nav">
  <li class="active"><a href="#" class="ipay trs">ABOUT<span class="sr-only">(current)</span></a></li>
    <li><a href="#slide2" class="ipaystore trs">IPAYSTORE</a></li>
    <li><a href="#" class="afiliasi trs">AFILIASI</a></li>
    <li><a href="#slide3" class="contact trs">CONTACT</a></li>
    <li><a href="#" class="blog trs">BLOG</a></li>
    
      <?php 
      if (Session::get('session') == null) {
        //echo '<li id="loginup" class="signup"><a href="#" class="loginmodal trs">Login</a> | <a href="#" class="signupmodal trs">Signup</a></li><li class="quicktrans"><div class="tile tile-trans rotate3d rotate3dY metro-tile centering"><div class="faces"><div class="front tile-orange iconpic centering"><img src="images/cashiericon.png" /></div><div class="back tile-darkore"><a href="trans_now"><p class="tile-parsmall centersmall">Transaksi<br>Sekarang</p></a></div></div></div></li>'; 
        //echo '<input type="hidden" value="';
        //echo Session::get('level'); 
        //echo '" />';
        echo '<input type="hidden" value="';
        echo Session::get('level'); 
        echo '" id="level_nonmember" />';
        echo '<li id="loginup" class="signup"><a href="http://192.168.173.14/" class="loginmodal trs">Login</a> | <a href="http://192.168.173.14/" class="signupmodal trs">Signup</a></li><li id="transnow" class="quicktrans"><div class="tile tile-trans rotate3d rotate3dY metro-tile centering"><div class="faces"><div class="front tile-orange iconpic centering"><img src="images/cashiericon.png" /></div><div class="back tile-darkore"><a href="#"><p class="tile-parsmall centersmall">Transaksi<br>Sekarang</p></a></div></div></div></li>';
        //echo '<li id="loginup" class="signup"><a href="http://192.168.173.14/" class="loginmodal trs">Login</a></li><li id="transnow" class="quicktrans"><div class="tile tile-trans rotate3d rotate3dY metro-tile centering"><div class="faces"><div class="front tile-orange iconpic centering"><img src="images/cashiericon.png" /></div><div class="back tile-darkore"><a href="#"><p class="tile-parsmall centersmall">Transaksi<br>Sekarang</p></a></div></div></div></li>';
      }
      /*else {
        //echo '<li id="blogout" class="signup"><a href="logout" class="logoutmodal trs">Logout</a></li><li id="transnow" class="quicktrans"><div class="tile tile-trans rotate3d rotate3dY metro-tile centering"><div class="faces"><div class="front tile-orange iconpic centering"><img src="images/cashiericon.png" /></div><div class="back tile-darkore"><a href="#"><p class="tile-parsmall centersmall">Transaksi<br>Sekarang</p></a></div></div></div></li>';
        echo '<input type="hidden" value="';
        echo Session::get('level'); 
        echo '" id="level_member" />';
        echo '<li><a href="#" class="daftar_trans trs">DAFTAR TRANSAKSI</a></li>';
        echo '<li id="tambahsaldo" class="signup" style="display: none"><a href="#">Transaksi Saldo</a></li>';
        echo '<li id="blogout" class="signup"><a href="logout" class="logoutmodal trs">Logout</a></li><li id="transnow" class="quicktrans"><div class="tile tile-trans rotate3d rotate3dY metro-tile centering"><div class="faces"><div class="front tile-orange iconpic centering"><img src="images/cashiericon.png" /></div><div class="back tile-darkore"><a href="#"><p class="tile-parsmall centersmall">Transaksi<br>Sekarang</p></a></div></div></div></li>';
        echo '<label align="right" align="right">Sisa Saldo: </label><p id="total-saldo">';
        echo Session::get('saldo');
        echo '</p><br>';
      }*/
      ?>
    
    <!--<label align="right" align="right">Sisa Saldo: </label><p id="total-saldo"><?php //echo Session::get('saldo'); ?></p><br>-->

  </ul>
</div></div>
<div id="mainslider" class="col-md-12 col-sm-12 col-xs-12">

</div>

<div id="slide1footer" class="hidden-xs col-md-12 col-sm-12 col-xs-12">
<div id="socmed" class="row-centered">
 <ul class="nav navbar-nav">
              <li><a href="#company"><img src="assets/images/facebookicon.png" class="trs"></a></li>
              <li><a href="#works"><img src="assets/images/twittericon.png" class="trs"></a></li>
              <li><a href="#clients"><img src="assets/images/youtubeicon.png" class="trs"></a></li>
              <li><a href="#team"><img src="assets/images/gplusicon.png" class="trs"></a></li>
              <li><a href="#joinus"><img src="assets/images/linkedin.png" class="trs"></a></li>
            </ul>
</div>
<div id="copyright" class="col-xs-12 pull-left row-centered">&copy; iPay Copyright 2016</div>
<a href="#slide2"><div id="nextbutton" class="col-md-2 col-sm-2 col-xs-2 row-centered pull-right trs">LAYANAN KAMI<br><i class="glyphicon glyphicon-chevron-down"></i></div></a>
</div>
<div id="minislide1footer" class="visible-xs col-md-12 col-sm-12 col-xs-12">
<div id="minicopyright" class="col-xs-12 row-centered">&copy; iPay Copyright 2016</div>
<a href="#slide2"><div id="mininextbutton" class="col-md-2 col-sm-2 col-xs-2 row-centered pull-right trs">LAYANAN KAMI<br><i class="glyphicon glyphicon-chevron-down"></i></div></a>
</div>
</div>

<div id="slide2" class="sct_2 container-fluid" >
<div id="minislide" class="col-md-12 col-xs-12 gr1bg">
 <div id="stepimage" class="animation-element slide-left showcase col-md-6 col-sm-6 col-xs-12">
     <img src="assets/images/step1.png">
    </div>
<div id="sidetext" class="animation-element slide-right showcase col-md-6 col-sm-6 col-xs-12">
<h1>TRANSAKSI PRAKTIS DALAM SATU PERANGKAT</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
veniam, quis nostrud exercitation ullamco laboris.</p>
<div id="detailbutton"><a href="#" class="trs">Selengkapnya</a></div>
</div>
  </div>
<div id="minislide" class="col-md-12 col-xs-12 gr2bg">
<div id="sidetext" class="animation-element slide-right showcase col-md-6 col-sm-6 hidden-xs">
<h1>SOLUSI UNTUK PEMBAYARAN ANDA</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
veniam, quis nostrud exercitation ullamco laboris.</p>
<div id="detailbutton"><a href="#" class="trs">Selengkapnya</a></div>
</div>
 <div id="stepimage" class="animation-element slide-left showcase col-md-6 col-sm-6 col-xs-12">
     <img src="assets/images/step2.png">
    </div>
  <div id="sidetext" class="col-xs-12 visible-xs">
<h1>LAYANAN PEMBAYARAN
BERSAMA IPAY</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
veniam, quis nostrud exercitation ullamco laboris.</p>
<div id="detailbutton"><a href="#">Selengkapnya</a></div>
</div>
  </div>
<div id="minislide" class="col-md-12 col-xs-12 gr3bg">
  <div id="stepimage" class="animation-element slide-left showcase col-md-6 col-sm-6 col-xs-12">
     <img src="assets/images/step3.png">
    </div>
<div id="sidetext" class="animation-element slide-right showcase col-md-6 col-sm-6 col-xs-12">
<h1>KAPANPUN DAN DIMANAPUN</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
veniam, quis nostrud exercitation ullamco laboris.</p>
<div id="detailbutton"><a href="#" class="trs">Selengkapnya</a></div>
</div>
  </div>
 </div>
 
<div id="slide3" class="sct_3 container-fluid bg6" data-type="background" data-speed="200">
<div id="slide3container" class="col-md-12 col-sm-12 col-xs-12">
<div id="leftside" class="col-md-6 col-sm-6 col-xs-6">
<h1 class="headtext">AYO GABUNG BERSAMA KAMI!</h2>

<div class="col-md-6 col-sm-6 col-xs-12">
<div class="tile tile-trans rotate3d rotate3dX metro-tile">
<div class="faces">
<div class="front tile-blue iconpic centering"><img src="assets/images/afiliasicon.png" /></div>
<div class="back tile-deepblue">
<p class="tile-parmed tilepad">Daftar Afiliasi Sekarang!</p>
</div>
</div>
</div></div>
<div class="col-md-6 col-sm-6 col-xs-12">
<div class="tile tile-trans rotate3d rotate3dX metro-tile">
<div class="faces">
<div class="front tile-gray iconpic centering"><img src="assets/images/ipaystore_logo.png" /></div>
<div class="back tile-gray">
<p class="tile-parmed tilepad">BUKA IPAYSTOREMU!</p>
</div>
</div>
</div>
</div>
</div>
<div id="rightside" class="col-md-6 col-sm-6 col-xs-6"></div>
</div>
 </div>

<div id="footer" class="col-md-12 col-sm-12 hidden-xs">

<div id="aboutIpay" class="col-md-2 col-sm-2 col-xs-2">
<p>About iPay</p>
      <ul>
        <li class="active"><a href="#slide1" class="trs">Home<span class="sr-only">(current)</span></a></li>
              <li><a href="#slide2" class="trs">Layanan Pembayaran</a></li>
              <li><a href="#slide3" class="trs">Products & Pricing</a></li>
              <li><a href="#slide4" class="trs">Berita & Promo</a></li>
        <li><a href="#slide4" class="trs">Karir bersama iPay</a></li>
            </ul>
</div>

<div id="ipayInfo" class="col-md-2 col-sm-2 col-xs-2">
<p>iPayStore</p>
      <ul>
        <li class="active"><a href="#slide1" class="trs">Produk & Layanan iPayStore<span class="sr-only">(current)</span></a></li>
              <li><a href="#slide2" class="trs">Pendaftaran iPayStore</a></li>
              <li><a href="#slide3" class="trs">Syarat dan Ketentuan</a></li>
              <li><a href="#slide4" class="trs">F.A.Q</a></li>
              <li><a href="#slide5" class="trs">Bantuan</a></li>
            </ul>
</div>

<div id="Affiliate" class="col-md-2 col-sm-2 col-xs-2">
<p>Affiliate</p>
      <ul>
        <li class="active"><a href="#slide1" class="trs">Tentang Afiliasi iPay<span class="sr-only">(current)</span></a></li>
              <li><a href="#slide2" class="trs">Pendaftaran Afiliasi</a></li>
              <li><a href="#slide3" class="trs">Syarat dan Ketentuan</a></li>
              <li><a href="#slide4" class="trs">F.A.Q Afiliasi</a></li>
              <li><a href="#slide5" class="trs">Bantuan Afiliasi</a></li>
            </ul>
</div>

<div id="ContactUs" class="col-md-6 col-sm-6 col-xs-6">
<div id="newsletter" class="col-md-6 col-sm-6">
<p>Stay in Touch</p>
<div class="col-md-12 col-xs-12 row-centered">Subscribe :</div>
<input type="text" placeholder="Type your Email"><button type="submit" class="fasttrs">SUBMIT</button>
<div id="footsocmed" class="col-md-12 col-xs-5 row-centered">
 <ul class="nav navbar-nav">
              <li><a href="#company"><img src="assets/images/facebookicon.png" class="trs"></a></li>
              <li><a href="#works"><img src="assets/images/twittericon.png" class="trs"></a></li>
              <li><a href="#clients"><img src="assets/images/youtubeicon.png" class="trs"></a></li>
              <li><a href="#team"><img src="assets/images/gplusicon.png" class="trs"></a></li>
              <li><a href="#joinus"><img src="assets/images/linkedin.png" class="trs"></a></li>
            </ul>
</div>
<div id="copyright" class="col-md-12 col-xs-12">
<hr>
&copy; iPay Copyright 2016</div>
</div>

<div id="location" class="col-md-6 col-sm-6 row-centered pull-right trs">
<div id="loctext" class="col-md-3 col-sm-3">
<div class="visittext tile-parmed trs">Visit Our Office</div>
<div class="address centersmall trs">
<i class="glyphicon glyphicon-home"></i><br><b>RUKO GRAHA DELTA</b><br> Jl. Diponegoro Sidoarjo<br><br>
<i class="glyphicon glyphicon-earphone"></i><br>031-8075702
</div>
</div>
<div id="map" class="col-md-9 col-sm-9">asd</div>
</div>
</div>

</div>
 </div>

 
<!-- MODAL LOGIN -->
<div class="modal fade" id="login" role="dialog">
  <div class="modal-dialog">       
<!-- Modal content-->
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
            <button id="logbutton" class="btn btn-warning col-md-12" name="submit"><i class="glyphicon glyphicon-send"></i> Login</button>
        </form>                       
      </div>
    </div>
  </div>
</div>
  
<!-- MODAL SIGNUP -->
<div class="modal fade" id="signup" role="dialog">
  <div class="modal-dialog"> 
  <!-- Modal content-->
    <div class="modal-content row-centered">
      <div class="modal-header">
        <div id="rghead" class="col-md-12 row-centered "><span><img src="images/regicon.png" />Isikan Data Diri Anda</span></div>
      </div>
      <div id="regform" class="col-md-7 col-sm-10 col-xs-10 col-centered">
        <form id="formreg" method="post" action="">
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
            <span class="detlogo col-md-2 col-xs-1"><img src="images/garudaicon.png" /></span>
            <span class="dettext col-md-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
            <span><button class="btn btn-link" onclick="remove()"><i class="glyphicon glyphicon-remove-circle"></i></button></span>
          </div>
      </div>

      <div class="modal-footer">
        <!-- Chek out transaksi-->
        <p><a id="chckout" class="close" data-dismiss="modal" href="#" onclick="cektransaksi()"><img src="images/finishbutton.png"/>Checkout</a></p>
        <!--<p><a id="chckout" class="close" data-dismiss="modal" href="#" onclick="ceklist()"><img src="images/finishbutton.png"/>Checkout</a></p>-->
        <!--<p><a id="chckout" class="close" data-dismiss="modal" href="#" onclick="checkOutCart()"><img src="images/finishbutton.png"/>Checkout</a></p>-->
      </div>
    </div>
  </div>
</div>
</body>
<script type="text/javascript">
  /*function cekLogin(){
     var data = $("#formlogin").serialize();
        $.ajax({
          url:'logedin',
          type: 'POST',
          data: data,
          success: function(){
            $("#blogout").show()
            $("#loginup").hide()
          }
        });
    }*/

    function cekUsername(){
        var data = $('input[name="susername"]').val();
        $.ajax({
            url:'cekUsername',
            type: 'POST',
            data: {"susername": data},
            success: function(res){
                var result = JSON.parse(res);
                //alert(res);
                if (result.status){
                    bootbox.alert("username tidak bisa digunakan");
                    $('input[name="susername"]').val("");
                    $('input[name="susername"]').focus();
                }
                else{}
            }
        });
    }
    function cekPassword(){
        var password = $('input[name="spassword"]').val();
        var cpassword = $('input[name="confpassword"]').val();
        if(password != cpassword){
            bootbox.alert("password harus sama");
            $('input[name="confpassword"]').val("");
            $('input[name="confpassword"]').focus();
        }
    }
    function signup(){
        var susername = $('input[name="susername"]');
        var spassword = $('input[name="spassword"]');
        var confpassword = $('input[name="confpassword"]');
        var noreg = $('input[name="noreg"]');
        var data = $("#formreg").serialize();
        $.ajax({
            url:'register',
            type: 'POST',
            data: data,
            success: function(res){
                alert(res);
                var hasil = JSON.parse(res);
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
                }
                else if(hasil.inserted){
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
                }
                else {
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
    function showCart(){
    $('#carts').modal('show');
    $('#stepwrappmain').html("");
    $.ajax({
      url:'getCart',
      type:'get',
      success:function(result){
        //alert(result);
        var cart = JSON.parse(result);
        $.each(cart,function(key,val){
          var produk = val.id_produk;
          var tujuan = val.tujuan;
          var qty = val.qty;
          $('#stepwrappmain').append('<div id="invgroup'+key+'" class="col-md-12 col-xs-12 row-centered"><span class="detlogo col-md-2 col-xs-1">'+qty+'</span><span class="dettext col-md-8 col-centered">Produk'+produk+' Tujuan: '+tujuan+'</span><span><button class="btn btn-link" onclick="remove_prod('+key+')"><i class="glyphicon glyphicon-remove-circle"></i></button></span></div>');
        });
      }
    });
  }
    function remove_prod(id){
    $.ajax({
      url:'removeFromCart',
      data:{'item':id},
      type:'post',
      success:function(res){
        $('#invgroup'+id).remove();
        var cart_count = $('#cart-count').html();
        $('#cart-count').html(cart_count-1);
      }
    });
  }
    function setComma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
</script>
</html>
