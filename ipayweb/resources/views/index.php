<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="csrf-token" content="<?php echo csrf_token(); ?>">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>iPay Payment System</title>
  <link href="bootstrap-3.3.5-dist/css/bootstrap.css" rel="stylesheet" type="text/css">
  <link href="bootstrap-3.3.5-dist/css/bootstrap-theme.css" rel="stylesheet" type="text/css">
  <link href="css/transaction.css" rel="stylesheet" type="text/css">
  <link href="css/dashboard.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" type="text/css" href="css/dataTables.min.css">
  <link href="css/styles.css" rel="stylesheet" type="text/css">
  <link href="css/datepicker.css" rel="stylesheet" type="text/css">
  <link href="css/sprites.less" rel="stylesheet" type="text/css">
  <link href="css/global.css" rel="stylesheet" type="text/css">
  <script src="js/dropzone.js"></script>
  <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
  <script type="text/javascript" src="bootstrap-3.3.5-dist/js/bootstrap.js"></script>
  <script type="text/javascript" src="js/datatables.min.js"></script>
  <script type="text/javascript" src="js/dataTables.bootstrap.min.js"></script>
  <script type="text/javascript" src="js/dataTables.buttons.min.js"></script>
  <script type="text/javascript" src="js/buttons.html5.min.js"></script>
  <script type="text/javascript" src="js/buttons.print.min.js"></script>
  <script type="text/javascript" src="js/pdfmake.min.js"></script>
  <script type="text/javascript" src="js/vfs_fonts.js"></script>
  <script type="text/javascript" src="js/jszip.min.js"></script>
  <script type="text/javascript" src="js/async.js"></script>
  <script type="text/javascript" src="js/bootbox.min.js"></script>
  <script type="text/javascript" src="js/bootstrap-datepicker.js"></script>
  <script type="text/javascript">
    <?PHP
      Session::forget('harga_agen');
      Session::forget('harga_wilayah');
      $level = Session::get('level');
      if($level!=0){
        echo 'function hidAdm(){$("#admin").html("");}';
        echo 'function gantiTombol(){}';
      }else{
        echo 'function hidAdm(){}';
        echo 'function gantiTombol(){$("#btn-tambah-saldo").html("Terapkan Saldo");}';
      }
      
    ?>
    function showNotifBar(){
      $('#notif-bar').fadeIn(200);
      //$('#notif-bar').fadeOut(10000);
    }
    function getNotif(data,callback){
      $.ajax({
        url:'get-notif',
        type:'post',
        data:data,
        success:function(result){
          //alert(result);
          var res=JSON.parse(result);
          if(!res.error){
            
            var notif_count = res.length;
            
            callback(res);
          }
        }
      })
    }
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
  function hideNotif(){
    $('#notif-bar').fadeOut(1000);
  }
  function checkNotif(){
    getNotif({status:'new'},function(rows){
      var notif_count = rows.length;
      var last_notif = $('#notif-count').html();
      $('.notif-count').html(notif_count);
      if(notif_count!=0){
        showNotifBar();
        getNotif({status:'posted'},function(rows){
          var count = rows.length;
          $('#notif-count').html(count);
        });
        getResponTrans(rows);
        setTimeout(hideNotif,5000);
      }
    });
  }
  function getResponTrans(rows){
    $.each(rows,function(key,val){
      var act = val.activity;
      if(act=='transaction'){
        var id = val.message.id_transaksi;
        var status = val.message.status;
        var bgcolor;
        var color = 'white';
        if(status=='sukses'){
          bgcolor = 'green';
        }else{
          bgcolor = 'red';
        }
        $('#row'+id).attr('style','background-color:'+bgcolor+';color:'+color);
        $('#stat'+id).html('<b>'+status+'</b>');
      }
    });
  }
   $(document).ready(function(){
    setInterval(checkNotif,7000);
    getNotif({status:'posted'},function(rows){
      var count = rows.length;
      $('#notif-count').html(count);
    });
    $('body').addClass('loaded');
    $("#logout").click(function(){
      $("#logoutmodal").modal();
    });
    $('#notif-bar').hover(function(){
      $(this).show();
      setTimeout(hideNotif,5000);
    });
    <?PHP 
    if(Session::has('lastpage')&&Session::get('level')!=3){
        echo 'var lastPage = "'.Session::get('lastpage').'";';
        //$harga = Session::get('harga_agen');
        //echo 'alert('.json_encode($harga).');';
      }else{
        echo 'var lastPage = "dashboard";';
        //echo 'alert('.Session::get('harga_agen').');';
      }
    ?>
   
    setTimeout(hideNotif,5000);
    $.ajax({
      url:'getCart',
      type:'get',
      success:function(result){
          //alert(result);
          var cart = JSON.parse(result);
          var count = Object.size(cart);
          //alert(count);
          $('#cart-count').html(count);
        }
      });
      // $(".input-number").keyup(function() {
      //     $(".input-number").val(this.value.match(/[0-9]*/));
      // });

      $.ajaxSetup({
        headers: {
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      $("#mainmenu").load("pages/"+lastPage+".html"); 

      var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
      $("head").append(cssLink); 

      $("#hmclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/dashboard.html');
        $('#switcher').remove();
         //alert("Thanks for visiting!");
         var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
         $("head").append(cssLink); 

         
       }); 
      // $("#cartmodal").click(function(){
      //     $("#carts").modal();
      //   });

      $("#reportclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/report.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/green.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#cktclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/cektrans.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/black.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#prdclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/aturproduk.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/blue.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#katclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/kategori.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/blue.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#aflclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/afiliasi.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/lightblue.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#cstclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/customerservice.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/lightgreen.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#suppclk").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/supplier.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/grey.css'>");
        $("head").append(cssLink); 
         //alert("Thanks for visiting!");
       });
      $("#transnow").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/quicktrans.php');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
        $("head").append(cssLink); 
      });
      $("#saldo-btn").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/saldo_member.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
        $("head").append(cssLink); 
      });
      $("#user-account").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/account.html');
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
        clearInterval();
        $('#addMem').load('pages/afiliasi.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
        $("head").append(cssLink); 
      });
      $("#loglink").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/login.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
        $("head").append(cssLink); 
      });
      $("#chckout").click(function(){
        clearInterval();
        $('#mainmenu').load('pages/checkout.html');
        $('#switcher').remove();
        var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
        $("head").append(cssLink); 
      });
    });

var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
$("head").append(cssLink); 
$('body').addClass('loaded');
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});

</script>
</head>

<body class="loaded gr1bg">
  <div id="notif-bar" class="notif-bar">
    <a href="" onclick="showNotif()" class="notif-link">
      <i class="glyphicon glyphicon-bell"></i> 
      <b class="notif-count">0</b> New notifications
    </a>
    |
    <a href="#" onclick="closeNotifBar()"><i class="glyphicon glyphicon-remove close-box"></i></a>
  </div>
  <div id="loader-wrapper" class="row row-centered">
    <div id="loader"><img src="images/loadicon.gif" /></div>
  </div>


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
            <span><button class="btn btn-link" onclick="remove()"><i class="glyphicon glyphicon-remove-circle"></i></button></span>
          </div>
          

        </div>

        <div class="modal-footer">
          <p><a class="close" data-dismiss="modal" onclick="checkOutCart()" href="#"><img src="images/finishbutton.png"  />Checkout</a></p>
        </div>
      </div>
    </div>
  </div>
  

  <div id="cont" class="col-md-12 col-xs-12">
    <div id="header" class="col-md-12 col-xs-12">
      <div id="headlogo" class="col-md-12 col-sm-12 col-xs-12 row-centered"><img src="images/icon.gif" ></div>
      <div id="smallicons" class="col-md-12 col-sm-12 col-xs-12">
        <ul class="smalliconsul">
          <li>
            <p><a href="#" id="user-account"><i class="glyphicon glyphicon-user"></i><?php echo Session::get('username'); ?> - <?php echo Session::get('nama'); ?></a></p>
          </li>
          <li>
            <p>|<a href="#" id="notif-btn"><i class="glyphicon glyphicon-bell"></i><span id="notif-count">0</span> New Notificaitons</a></p>
          </li>
          <li>
            <p>|<a href="#" id="saldo-btn"><i class="glyphicon glyphicon-usd"></i><span id="saldo-member"><?php echo Session::get('saldo'); ?></span></a></p>
          </li>
          <li>
            <p>|<a id="logout" href="#" data-toggle="modal"><i class="glyphicon glyphicon-off"></i>Logout</a></p>
          </li>
        </ul>
      </div>
      <div id="trans_buttons" class="col-md-5 col-sm-3 col-xs-4">
          <div id="shopping_cart" class="col-md-3 col-sm-3 col-xs-12 row-centered">
            <a href="#" class="cartmodal trs" onclick="showCart()"><div class="col-md-6 col-sm-6 col-xs-6"><img class="trs" src="images/shopcart_icon.png" class="trs"></div>
              <div class="col-md-6 col-sm-6 col-xs-6"><p  class="trs" id="cart-count">0</p></div></a>
          </div>
          <div class="trans_now col-md-3 col-sm-3 col-xs-12"><a href="#" id="transnow" class="transnow trs">
            <div class="col-md-6 col-sm-6"><img src="images/cashiericon.png" /></div>
            <div class="col-md-6 col-sm-6">Transaksi Sekarang</div></a>
          </div>
          <div class="find_now col-md-3 col-sm-3 col-xs-12"><a href="#" class="transnow trs" id="cktclk">
            <div class="col-md-6 col-sm-6"><img src="images/searchbigicon.png" /></div>
            <div class="col-md-6 col-sm-6">Cek Transaksi</div></a>
          </div>
          </div>
        </div>

        <div id="mainbody" class="col-md-12 col-xs-12">
          <div id="leftnav" class="col-md-1 col-sm-1 col-xs-1 gr3bg">
            <ul class="mainnavul row-centered or1bg">
              <li><a id="hmclk" href="#" class="f1w navbutton row-centered"><img src="images/dashboardicon.png" /><p>Home</p></a></li>
              
              <li><a id="reportclk" href="#" class="f1w navbutton"><img src="images/reportbigicon.png" /><p>Report</p></a></li>
              <?PHP if(Session::get('level')==0){ ?>
              <li><a id="katclk" href="#" class="f1w navbutton"><img src="images/Categorize-100.png" /><p>Kategori Produk</p></a></li>
              <li><a id="suppclk" href="#" class="f1w navbutton"><img src="images/supplier.png" /><p>Supplier</p></a></li>
              <li><a id="nonclk" href="#" class="f1w navbutton"><img src="images/customerbigicon.png" /><p>Non Agen</p></a></li>
              <?PHP }else{ ?>
              
              <li><a id="nonclk" href="#" class="f1w navbutton"><img src="images/customerbigicon.png" /><p>Non Agen</p></a></li>
              <?PHP } ?>
              <?PHP if(Session::get('level')<3){ ?>
              <li><a id="prdclk" href="#" class="f1w navbutton"><img src="images/product.png" /><p>Produk</p></a></li>
              <li><a id="aflclk" href="#" class="f1w navbutton"><img src="images/afiliasicon.png" /><p>Afiliasi</p></a></li><?PHP } ?>
            </ul>
          </div>

          <div id="mainmenu" class="col-md-11 col-xs-11 wbg shd">

            <!--START MAINPAGE-->

<!--
END OF MAIN PAGE
-->
</div>
</div>
</div>
</div>
<!-- Modal -->
<div class="modal fade" id="logoutmodal" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header row-centered">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h1><i class="glyphicon glyphicon-off"></i></h1>
        <h3>Apakah anda yakin ingin keluar?</h3>  		
      </div>
      <div class="modal-body">
         <div class="col-md-6 row-centered"><a href="logout" class="yes"><i class="glyphicon glyphicon-ok"></i></a></div>
         <div class="col-md-6 row-centered no"><a href="" class="no" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></a></div>
     </div>
   </div></div></div>


   <script type="text/javascript">
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
    function checkOutCart(){
      $.ajax({
        url:'checkOutCart',
        type:'post',
        success:function(result){
          alert(result);
          var res = JSON.parse(result);
          if(res.error){
            alert(res.message);
          }else{
            $('#cart-count').html(0);
            //alert(res.status);
            $('#mainmenu').load('pages/home.html');
            $('#switcher').remove();
             //alert("Thanks for visiting!");
             var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
             $("head").append(cssLink); 
           } 
         }
       })
    }
    function setComma(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  </script>
</body>
</html>
