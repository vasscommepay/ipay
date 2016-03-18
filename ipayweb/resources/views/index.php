<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="csrf-token" content="<?php echo csrf_token(); ?>">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Ipay V1.0</title>
<link href="bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet" type="text/css">
<link href="bootstrap-3.3.5-dist/css/bootstrap-theme.css" rel="stylesheet" type="text/css">
<link href="css/styles.css" rel="stylesheet" type="text/css">
<link href="css/demo-styles.css" rel="stylesheet" type="text/css">
<link href="css/tilestyle.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="bootstrap-3.3.5-dist/js/bootstrap.js"></script>
<script type="text/javascript" src="js/bootstrap-carousel.js"></script>     
<script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
<script type="text/javascript">
$.ajaxSetup({
              headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
              }
      });
	  $(document).ready(function(){
      $.ajaxSetup({
              headers: {
                  'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
              }
      });
		  $("#mainmenu").load("pages/home.html"); 

var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
	
       $("#hmclk").click(function(){
        $('#mainmenu').load('pages/home.html');
		$('#switcher').remove();
         //alert("Thanks for visiting!");
		 var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
	 
	     $("#cartmodal").click(function(){
        $("#carts").modal();
    });
       }); 

       $("#lynclk").click(function(){
		
		      $('#mainmenu').load('pages/layanankami.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/green.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	   $("#cktclk").click(function(){
        $('#mainmenu').load('pages/cektrans.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/black.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	   $("#pdnclk").click(function(){
        $('#mainmenu').load('pages/panduanfaq.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/blue.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	   $("#aflclk").click(function(){
        $('#mainmenu').load('pages/afiliasi.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/lightblue.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	   $("#cstclk").click(function(){
        $('#mainmenu').load('pages/customerservice.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/lightgreen.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	    $("#brtclk").click(function(){
        $('#mainmenu').load('pages/berita.html');
		$('#switcher').remove();
     var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/grey.css'>");
     $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
	      $("#transnow").click(function(){
        $('#mainmenu').load('pages/quicktrans.html');
		$('#switcher').remove();
 var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
       });
	   $("#signlink").click(function(){
        $('#mainmenu').load('pages/register.html');
		$('#switcher').remove();
    var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
       });
     $("#signlink").click(function(){
        $('#addMem').load('pages/afiliasi.html');
    $('#switcher').remove();
 /*var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
       });
	   $("#loglink").click(function(){
        $('#mainmenu').load('pages/login.html');
		$('#switcher').remove();*/
 var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
       });
	   $("#chckout").click(function(){
        $('#mainmenu').load('pages/checkout.html');
		$('#switcher').remove();
 var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
     $("head").append(cssLink); 
       });
     });
 var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
  $("head").append(cssLink); 
  $('body').addClass('loaded');
  $("#logout").click(function(){
    $("#logoutmodal").modal();
  });
 $.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
  
</script>
</head>

<body>
  <!-- Modal -->
  <input type="hidden" value="<?PHP echo Session::get('level'); ?>" id="level_member">
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
<span><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>
<div id="invgroup" class="col-md-12 col-xs-12 row-centered">
<span class="detlogo col-md-2 col-xs-1"><img src="images/garudaicon.png" /></span>
<span class="dettext col-md-8 col-centered">Pembayaran Tiket Garuda Nomor:7ASGC8</span>
<span><i class="glyphicon glyphicon-remove-circle"></i></span>
</div>

</div>

          <div class="modal-footer">
            <p><a id="chckout" class="close" data-dismiss="modal" href="#"><img src="images/finishbutton.png"  />Checkout</a></p>
          </div>
        </div>
      </div>
    </div>
<div id="wrapper" class="container-fluid">

<div id="main-wrapper" class="row">
<div id="leftmenu" class="col-lg-3 col-md-3 col-sm-3 col-xs-2">
<div id="logo" class="row row-centered"><img src="images/icon.gif" /></div>
<div id="mini-menu" class="row row-centered">
<div class="col-md-4 col-sm-6 hidden-xs"><a id="signlink" href="#"><div class="iconedit"></div>Add Member</a></div>
<div class="col-md-4 col-sm-6 hidden-xs"><a href="logout"><div class="iconkey"></div>Logout</a></div>
<div class="col-md-4 col-sm-12 col-xs-12 transbutton"><a id="cartmodal" data-dismiss="modal" data-toggle="modal" href="#carts"><div class="col-md-3 col-sm-3 col-xs-6"><div class="iconcart "></div></div><div class="transtext col-md-5 col-sm-5 hidden-xs">Cart</div><div class="transamount col-md-3 col-sm-3 col-xs-6">2</div></a></div>
</div>
<div id="main-menu">	
<div class="row row-centerd g"><a id="hmclk" href="#"><img src="images/homeicon.png" /><span class="hidden-xs">Home</span></a></div>
<div class="row"><a id="lynclk" href="#"><img src="images/layananicon.png" /><span class="hidden-xs">Layanan</span></a></div>
<div class="row g"><a id="cktclk" href="#"><img src="images/cek.png" /><span class="hidden-xs">Cek Transaksi</span></a></div>
<div class="row "><a id="pdnclk" href="#"><img src="images/panduanfaq.png" /><span class="hidden-xs">Panduan & FAQ</span></a></div>
<div class="row g"><a id="aflclk" href="#"><img src="images/afiliasi.png" /><span class="hidden-xs">Afiliasi</span></a></div>
<div class="row "><a id="cstclk" href="#"><img src="images/customer.png" /><span class="hidden-xs">Customer Service</span></a></div>
<div class="row g"><a id="brtclk" href="#"><img src="images/beritakami.png" /><span class="hidden-xs">Berita Kami</span></a></div>
</div>
<a id="transnow" href="#">
<div id="cta" class="row hidden-xs">
<div class="transkrgbutton"></div>
<div class="transaksitext col-md-12">Transaksi Sekarang</div>
<div class="transaksitextunder col-md-12">Lakukan transaksi tanpa registrasi!</div>
</div>
</a>
<div id="footer">
<div id="footmenu" class="row row-centered hidden-xs">
<ul>
<li><a href="#">Layanan</a></li>
<li><a href="#">Tentang Kami</a></li>
<li><a href="#">Kontak kami</a></li>
<li><a href="#">Layanan</a></li>
<li><a href="#">Layanan</a></li>
</ul>
</div>
<div class="row row-centered">
<div id="socmedwrapp" class="col-md-12 col-sm-12 col-xs-12 row-centered">
<div class="col-md-2 col-sm-2 col-xs-6 col-centered"><a href="#"><img src="images/fb.png" /></a></div>
<div class="col-md-2 col-sm-2 col-xs-6 col-centered"><a href="#"><img src="images/twitter.png" /></a></div>
<div class="col-md-2 col-sm-2 col-xs-6 col-centered"><a href="#"><img src="images/google.png" /></a></div>
<div class="col-md-2 col-sm-2 col-xs-6 col-centered"><a href="#"><img src="images/mail.png" /></a></div>
</div>
</div>
<div id="foottext" class="row row-centered">iPay Copyright © 2010-2015 All Rights Reserved</div>
</div>	
</div>

<div id="mainmenu" class="col-lg-9 col-md-9 col-sm-9 col-xs-10">


</div>
</div>
</div>
</div></div>



</body>
</html>
