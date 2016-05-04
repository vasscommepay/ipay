<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="csrf-token" content="1PKPaDDzhRvylhsEmKV6himQYC5IReUHg4ecuGTh">
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
   $(document).ready(function(){

    $('body').addClass('loaded');
    $("#logout").click(function(){
      $("#logoutmodal").modal();
    });
  });
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

  $(document).ready(function(){

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
      $("#mainmenu").load("pages/dashboard.html"); 

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
  <div id="loader-wrapper" class="row row-centered">
    <div id="loader"><img src="images/loadicon.gif" /></div>
  </div>


  <!-- Modal -->
  <input type="hidden" value="0" id="level_member">
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
            <p>Selamat Datang <a href="#"><i class="glyphicon glyphicon-user"></i>sibagus - ipay</a></p>
          </li>
          <li>
            <p>|<a href="#"><i class="glyphicon glyphicon-usd"></i>44786500</a></p>
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
            <li><a id="prdclk" href="#" class="f1w navbutton"><img src="images/product.png" /><p>Produk</p></a></li>
            <li><a id="katclk" href="#" class="f1w navbutton"><img src="images/Categorize-100.png" /><p>Kategori Produk</p></a></li>
            <li><a id="suppclk" href="#" class="f1w navbutton"><img src="images/supplier.png" /><p>Supplier</p></a></li>
            <li><a id="nonclk" href="#" class="f1w navbutton"><img src="images/customerbigicon.png" /><p>Non Agen</p></a></li>
            
            <li><a id="aflclk" href="#" class="f1w navbutton"><img src="images/afiliasicon.png" /><p>Afiliasi</p></a></li>            </ul>
          </div>

          <div id="mainmenu" class="col-md-11 col-xs-11 wbg shd">
            <script type="text/javascript">
              var table = $('#daftar-produk').DataTable();
              var table_agen = $('#table-daftar-agen').DataTable();
              var table_wilayah = $('#tabel-daftar-wilayah').DataTable();
              function reloadTable(){
                $.ajax({
                  type:'post',
                  url:'produk',
                  success:function(result){
        //alert(result);
        var datas = JSON.parse(result);
        //alert(result);
        if(!datas.error){
          table.rows().remove().draw();
          var i =0;
          //alert(transaksi);
          $.each(datas,function(key,val){
            i++
            var time = new Date(val.created_at);
            var tanggal = time.toDateString();
            if(val.aktif==1 && val.kosong==0){
              var status = 'OK';
            }else if(val.aktif==0){
              var status = 'Non-Aktif';
            }else{
              var status = 'Kosong';
            }
            var harga = 0;
            if(val.harga_beli!=null){
              harga = setComma(val.harga_beli);
            }

            var rownode = table.row.add([
              i,
              val.id,
              val.nama,
              harga,
              val.nominal,
              val.id_super_kategori,
              val.kategori_produk,
              val.tipe,
              status,
              "<div class='btn-group'><button class='btn btn-warning' type='button' onclick='editProduk("+key+")'><i class='glyphicon glyphicon-edit'></i></button><button class='btn btn-danger' type='button' onclick='delProduk("+key+")'><i class='glyphicon glyphicon-trash'></i></button></div>"
              ]).draw().node();

            if(status!='OK'){
              $(rownode).css('background-color','red');
              $(rownode).css('color','white');
            }
          });
        }
       //alert(result);
       
     }
   });
              }

              $(document).ready(function(){

                $('.startdate').datepicker();
                $('.enddate').datepicker();

                new $.fn.dataTable.Buttons( table, {
                  buttons: [
                  'excel', 'pdf','print'
                  ],
                  select:true
                } );

                table.buttons().container().appendTo( $('.col-sm-6:eq(1)', table.table(".table1").container() ) );

                $.ajax({
                  type:'post',
                  url:'kategori',
                  success:function(result){
        //alert(result);
        reloadTable();
        var res = JSON.parse(result);
        $.each(res,function(key,val){
          $('#kategori-produk').append('<option value="'+val.id_kategori+'">'+val.nama_kategori+'</option>');
          $('#super-category').append('<option value="'+val.id_kategori+'">'+val.nama_kategori+'</option>');
        });
      }
    });

              });
            </script>

            <div id="basemain" class="col-md-12 col-xs-12 col-sm-12 row-centered">
              <div id="maintitle" class="col-md-12 col-xs-12 col-sm-12 g4 fbig">
                <h1 class="col-md-6 col-sm-6 col-xs-6">ATUR PRODUK</h1>
              </div>
              <div id="datecont" class="col-centered or1bg sharpshadow">
                <form method="POST" action="<?php echo base_url();?>panelcontrol/filterTagihan">
                  <div id='datecont' class='date-time col-md-12 col-sm-12 col-xs-12 col-centered'>
                    <div class='col-md-4 col-xs-3 row-centered nopad'>From : <input id='startdate' name="start" class="startdate"></div>
                    <div class='col-md-3 col-xs-3 row-centered nopad'>To : <input id='enddate' name="end" class="enddate" width="2vw"></div>
                    <div class='col-md-4 col-xs-4 row-centered'>Filter : 
                      <select name="filtering">
                        <option value="">Opsi Filter</option>
                        <option value="1">Terbayar</option>
                        <option value="2">Belum Terbayar</option>
                        <option value="3">View All</option>
                      </select>
                    </div>
                    <div class='col-md-1 col-xs-1 row-centered g1'>
                      <button type='submit' name='filter' id='filter' class='roundbutton wbg g1'><i class='glyphicon glyphicon-filter'></i></button> 
                    </div>
                  </div>

                </form>
              </div>


              <div class="panel panel-default col-md-6" id="panel-add-produk">
                <div class="panel-heading" id="add-produk-heading"><img src="images/addprod.png"/><a id="add-produk-btn" class="f1w navbutton" onclick="showAdd()">Tambah Produk</a></div>
                <div class="panel-body vistrs" id="body-tambah-produk" style="display: none;">
                  <form id="form-add-produk">
                    <div class="row">
                      <div class="col-md-6">
                        Id Produk
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="id_produk"></input>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        Nama Produk
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="nama_produk"></input>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        Tipe Produk
                      </div>
                      <div class="col-md-6">
                        <select class="form-control" name="tipe_produk">
                          <option value="token">Token</option>
                          <option value="postpaid">Postpaid</option>
                          <option value="prepaid">Prepaid</option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6" id="harga-beli">
                        Harga Beli
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="harga_produk"></input>
                      </div>
                    </div>
                    <div class="row" id="nominal-produk">
                      <div class="col-md-6">
                        Nominal
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="nominal_produk"></input>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        Kategori
                      </div>
                      <div class="col-md-6">
                        <select class="form-control" id="kategori-produk" onchange="tampilSubKat()">
                          <option id="default-kategori">Pilih Kategori</option>
                        </select>
                      </div>
                    </div>
                    <div class="row" id="subkategori-row" style="display: none">
                      <div class="col-md-6">
                        Subkategori
                      </div>
                      <div class="col-md-6">
                        <select class="form-control" name="kategori_produk" id="subkategori-produk">

                        </select>
                      </div>
                    </div>
                    <div class="row" id="edit-field" style="display: none">
                      <div class="row" id="subkategori-row">
                        <div class="col-md-6">
                          Status Aktif
                        </div>
                        <div class="col-md-6">
                          <select class="form-control" name="status_aktif" id="status-aktif">
                            <option value="1" id="aktif">Aktif</option>
                            <option value="0" id="nonaktif">Tidak Aktif</option>
                          </select>
                        </div>
                      </div>
                      <div class="row" id="subkategori-row">
                        <div class="col-md-6">
                          Ketersediaan
                        </div>
                        <div class="col-md-6">
                          <select class="form-control" name="status_kosong" id="status-kosong">
                            <option value="0" id="tersedia">Tersedia</option>
                            <option value="1" id="kosong">Kosong</option>
                          </select>
                        </div>
                      </div>
                      <div class="row" id="subkategori-row">
                        <div class="col-md-6">
                          Keterangan
                        </div>
                        <div class="col-md-6">
                          <textarea class="form-control" name="keterangan"></textarea>
                        </div>
                      </div>
                    </div>
                    <br>
                    <div class="row">
                      <div class="col-md-8" align="left">
                        <div id="add-btn" class="">
                          <button class="btn btn-info" type="button" onclick="addSup()"><span class="glyphicon glyphicon-wrench"></span> Supplier</button>
                          <button class="btn btn-success" type="button" onclick="setupAgen()"><span class="glyphicon glyphicon-wrench"></span> Agen</button>  
                        </div>
                      </div>
                      <div id="edit-btn" style="display: none" class="btn-group">
                        <button class="btn btn-success" type="button" onclick="updateProduk()">Simpan</button>
                        <button class="btn btn-danger" type="button" onclick="cancelEdit()">Batal</button>
                      </div>
                      <div class="col-md-4" align="right">
                        <button class="btn btn-primary" type="button" onclick="addProduk()">Tambahkan</button>

                      </div>
                    </div>
                  </form>
                </div>

              </div>
              <div class="panel panel-default col-md-6" id="panel-add-kategori">
                <div class="panel-heading"><img src="images/addcat.png" /><a id="add-kategori-btn" class="f1w navbutton" onclick="showAddKat()">Tambah Kategori</a></div>
                <div class="panel-body vistrs" id="body-tambah-kategori" style="display: none;">
                  <form id="form-add-kategori">
                    <div class="row">
                      <div class="col-md-6">
                        <input  name="tipe-kategori" type="radio" value="kategori">Kategori
                      </div>
                      <div class="col-md-6">
                        <input  name="tipe-kategori" type="radio" value="subkategori">Subkategori
                      </div>
                    </div><br>
                    <div class="row subkat-field" style="display: none">
                      <div class="col-md-6">
                        Super Kategori
                      </div>
                      <div class="col-md-6">
                        <select id="super-category" class="form-control" name="super_kategori">
                          <option id="default-super-category" value="">Pilih super category</option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        Id Kategori
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="id_kategori">
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        Nama Kategori
                      </div>
                      <div class="col-md-6">
                        <input class="form-control" name="nama_kategori"></input>
                      </div>
                    </div>
                    
                    <br>
                    <div class="row subkat-field" style="display: none">
                      <div class="col-md-6">
                        Pilih Formulir          
                      </div>
                      
                    </div>
                    <br>
                    <table class="tabel subkat-field" style="width: 90%;margin-left: 10%; display: none">
                      <thead>
                        <tr>
                          <td><i class="glyphicon glyphicon-check"></i></th>
                            <td >Jenis Formulir</th>
                              <td >Label</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr id="pilih-produk">
                                <td ><input type="checkbox" id="ck-pilih-produk" name="produk"></td>
                                <td >Pilih Produk</td>
                                <td >
                                  <input type="hidden" name="form[1][tipe]" class="inp-pilih-produk" disabled="" value="select">
                                  <input type="hidden" name="form[1][nama]" class="inp-pilih-produk" disabled="" value="produk">
                                  <input type="text" name="form[1][label]" class="form-control inp-pilih-produk" id="inp-pilih-produk" disabled=""></td>
                                </tr>
                                <tr id="pilih-produk">
                                  <td><input type="checkbox" id="ck-tujuan-kirim" name="tujuan"></td>
                                  <td>Tujuan Kirim</td>
                                  <td>
                                    <input type="hidden" name="form[2][tipe]" class="inp-tujuan" disabled="" value="text">
                                    <input type="hidden" name="form[2][nama]" class="inp-tujuan" disabled="" value="tujuan">
                                    <input type="text" name="form[2][label]" class="form-control inp-tujuan" id="inp-tujuan" disabled=""></td>
                                  </tr>
                                  <tr id="pilih-produk">
                                    <td><input type="checkbox" id="ck-kuantitas" name="kuantitas"></td>
                                    <td>Kuantitas</td>
                                    <td>
                                      <input type="hidden" name="form[3][tipe]" class="inp-kuantitas" disabled="" value="number">
                                      <input type="hidden" name="form[3][nama]" class="inp-kuantitas" disabled="" value="quantity">
                                      <input type="text" name="form[3][label]" class="form-control inp-kuantitas" id="inp-kuantitas" disabled="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <br>
                              <div class="row">
                                <div class="col-md-6">
                                </div>
                                <div class="col-md-6" align="right">
                                  <button id="addKategori-btn" class="btn btn-primary" onclick="addKategori()" type="button">Tambahkan</button>
                                </div>
                              </div>
                            </form>
                          </div>  
                        </div>



                        <div id="maintable" class="col-md-12 col-xs-12 col-sm-12">
                          <table id="daftar-produk" class="display table table1 table-striped table-bordered" cellspacing="0" width="100%">
                            <thead>
                              <tr>
                                <td width="5%">#</td>
                                <td width="10%">Id Produk</td>
                                <td width="15%">Nama</td>
                                <td width="10%">Harga</td>
                                <td width="10%">Nominal</td>
                                <td width="10%">Kategori</td>
                                <td width="10%">Subkategori</td>
                                <td width="5%">Tipe</td>
                                <td width="5%">Status</td>
                                <td width="10%">Opsi</td>
                              </tr>
                            </thead>
                            <tbody>

                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div id="modal-set-supplier" class="modal fade" tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 class="modal-title">Tambah Supplier</h4>
                            </div>
                            <div class="modal-body">
                              <div class="col-md-6">
                                <div class="panel panel-default">
                                  <div class="panel-heading">Daftar Supplier</div>
                                  <div class="panel-body">
                                    <table class="table table-hover table-striped" id="sup-table">
                                      <thead>
                                        <tr>
                                          <td><i class="glyphicon glyphicon-check"></i></td>
                                          <td>Id</td>
                                          <td>Nama</td>
                                        </tr>
                                      </thead>
                                      <tbody id="list-sup">

                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="panel panel-primary">
                                  <div class="panel-heading">Assigned Supplier</div>
                                  <div class="panel-body">
                                    <form id="form-tambah-supplier">
                                      <table class="table table-hover table-striped" id="sup-table">
                                        <thead>
                                          <tr>
                                            <td>Id</td>
                                            <td>Harga</td>
                                            <td><i class="glyphicon glyphicon-trash"></i></td>
                                          </tr>
                                        </thead>
                                        <tbody id="list-assigned-sup">

                                        </tbody>
                                      </table>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                              <button type="button" class="btn btn-primary" onclick="submitSup()">Tambahkan</button>
                            </div>
                          </div><!-- /.modal-content -->
                        </div><!-- /.modal-dialog -->
                      </div>
                      <div id="modal-set-agen" class="modal fade" tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                              <h4 class="modal-title">Atur Harga Keagenan</h4>
                            </div>
                            <div class="modal-body">
                              <div id="per-level" class="col-md-12">
                                <div class="row">
                                  <div class="col-md-4">
                                    <label>Terapkan harga untuk semua downlink</label>
                                  </div>
                                  <div class="col-md-8">
                                    <input type="number" name="harga_all" class="form-control">
                                  </div>
                                </div>
                              </div>  
                              <div id="per-wilayah" class="col-md-6" style="display: none">
                                <div class="panel panel-default">
                                  <div class="panel-heading">
                                    Atur per wilayah
                                  </div>
                                  <div class="panel-body">
                                    <table class="table table-hover table-stripped" id="tabel-daftar-wilayah">
                                      <thead id="thead-daftar-wilayah">
                                        <tr>
                                          <td>Id</td>
                                          <td>Nama</td>
                                          <td>Harga</td>
                                        </tr>
                                      </thead>
                                      <tbody id="tbody-daftar-wilayah">
                                        
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div id="per-id" class="col-md-6" style="display: none">
                                <div class="panel panel-default">
                                  <div class="panel-heading">
                                    Atur Per Downlink
                                  </div>
                                  <div class="panel-body">
                                    <table class="table table-hover table-stripped" id="table-daftar-agen">
                                      <thead id="thead-daftar-agen">
                                        <tr>
                                          <td>Id</td>
                                          <td>Nama</td>
                                          <td>Harga</td>
                                        </tr>
                                      </thead>
                                      <tbody id="tbody-daftar-agen">
                                        
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-danger" data-dismiss="modal">Batal</button>
                              <button type="button" class="btn btn-primary" onclick="submitHarga()">Tambahkan</button>
                            </div>
                          </div><!-- /.modal-content -->
                        </div><!-- /.modal-dialog -->
                      </div>
                      <script type="text/javascript">
                        $('#ck-pilih-produk').change(function(){
                          if($(this).is(':checked')){
                            $('.inp-pilih-produk').removeAttr('disabled');
                          }else{
                            $('.inp-pilih-produk').attr('disabled',true);
                          }
                        });
                        $('#ck-kuantitas').change(function(){
                          if($(this).is(':checked')){
                            $('.inp-kuantitas').removeAttr('disabled');
                          }else{
                            $('.inp-kuantitas').attr('disabled',true);
                          }
                        });
                        $('#ck-tujuan-kirim').change(function(){
                          if($(this).is(':checked')){
                            $('.inp-tujuan').removeAttr('disabled');
                          }else{
                            $('.inp-tujuan').attr('disabled',true);
                          }
                        });
                        $('input[name=tipe-kategori]').change(function(){
                          if($(this).val()=='subkategori'){
                            $('.subkat-field').show();
                          }else{
                            $('.subkat-field').hide();
                          }
                        });
                        $('select[name=tipe_produk]').change(function(){
                          var tipe = $('select[name=tipe_produk]').val();
                          if(tipe=='prepaid' || tipe=='token'){
                            $('#harga-beli').html('Harga Beli');
                            $('#nominal-produk').show();
                          }else{
                            $('#harga-beli').html('Keuntungan');
                            $('#nominal-produk').hide();
                          }
                        });
                        function submitHargaWilayah(callback){
                         var data = table_wilayah.$('input').serialize();
                         if(data!=null){
                          $.ajax({
                            url:'submit-harga-wilayah',
                            data:data,
                            type:'post',
                            success:function(result){
                              callback(result);
                            }
                          });
                        }
                      }
                      function submitHargaAgen(callback){
                       var data = table_agen.$('input').serialize();
                       if(data!=null){
                        $.ajax({
                          url:'submit-harga-agen',
                          data:data,
                          type:'post',
                          success:function(result){
                            callback(result);
                          }
                        });
                      }
                    }
                    function submitHarga(){
                      $('#modal-set-agen').mdoal('hide');
                      submitHargaAgen(function(result){
                        var agen_res = result;
                        submitHargaWilayah(function(res){
                          var wil_res = res;
                          alert(agen_res.concat(wil_res));
                        });
                      });
                    }
                    function setupAgen(){
                      loadDownlink();
                      loadWilayah();
                      $('#modal-set-agen').modal('show');
                    }
                    function loadDownlink(){
                      $.ajax({
                        url:'loadDownlink',
                        type:'post',
                        success:function(result){
                          table_agen.clear();
                          if(result!='noaccess'){
                            var res = JSON.parse(result);
                            $.each(res,function(key,val){
                              var id = val.id_member;
                              var nama = val.nama;
                              var input = '<input name="harga_downlink['+id+']" type="number" class="form-control">';
                              table_agen.row.add([
                                id,
                                nama,
                                input
                                ]).draw(false);
                            });
                            $('#per-id').show();
                          }
                        }
                      })
                    }
                    function loadWilayah(){
                      $.ajax({
                        url:'loadWilayah',
                        type:'post',
                        success:function(result){
                          table_wilayah.clear();
                          if(result!='noaccess'){
                            var res = JSON.parse(result);
                            $.each(res,function(key,val){
                              var id = val.id;
                              var nama = val.nama;
                              var input = '<input name="harga_wilayah['+id+']" type="number" class="form-control">';
                              table_wilayah.row.add([
                                id,
                                nama,
                                input
                                ]).draw(false);
                            });
                            $('#per-wilayah').show();
                          }
                        }
                      });
                    }
                    function loadSup(){
                      $.ajax({
                        url:'getSupplier',
                        type:'post',
                        success:function(result){
        //lert('hai');
        var res = JSON.parse(result);
        $.each(res,function(key,val){
          var id = '<td>'+val.id_sup+'</td>';
          var nama = '<td>'+val.nama_supplier+'</td>';
          var select = '<td><input type="checkbox" id="inp-sup-'+val.id_sup+'" onclick="assignSup(&#39;'+val.id_sup+'&#39;,&#39;'+val.nama_supplier+'&#39;)"></td>';
          $('#list-sup').append('<tr>'+select+id+nama+'</tr>');
        });
      }
    });
                    }
                    function submitSup(){
                      var data = $('#form-tambah-supplier').serialize();
                      $.ajax({
                        url:'assignSup',
                        type:'post',
                        data:data,
                        success:function(result){
                          alert(result);
                        }
                      });
                    }
                    function assignSup(id,nama){

                      var input = '<input name="prod_supplier[&#39;'+id+'&#39;]" value="'+id+'" type="hidden">';
                      var id_sup = '<td>'+id+'</td>';
                      var harga = '<td><input name="supplier[&#39;'+id+'&#39;]" type="number" class="form-control"></td>';
                      var hapus = '<td><button class="btn btn-danger btn-sm" type="button" id="unass-'+id+'" onclick="unass(&#39;'+id+'&#39)";>X</button></td>'
                      if($('#inp-sup-'+id).is(':checked')){
                        $('#list-assigned-sup').append('<tr id="rowass-'+id+'">'+id_sup+harga+hapus+'</tr>');
                      }else{
                        $('#rowass-'+id).remove();
                      }
                    }
                    function unass(id){
                      $('#inp-sup-'+id).prop('checked', false);
                      $('#rowass-'+id).remove();
                    }
                    function addSup(){
                      $('#list-assigned-sup').html('');
                      $('#list-sup').html('');
                      loadSup();
                      $('#modal-set-supplier').modal('show');
                    }
                    function showSuper(){
                      $('#superCategory').show();
                    }
                    function hideSuper(){
                      $('#super-category').val('');
                      $('#default-super-category').attr('selected','selected');
                      $('#superCategory').hide();
                    }
                    function showType(){
                      var type = $('select[name=tipe_produk]').val();
                      if(type=='postpaid'){
                        $('.prepaid').show();
                        $('.postpaid').show();
                      }else{
                        $('.postpaid').hide();
                        $('.prepaid').show();
                      }
                    }
                    function showAdd(){
                      $('#body-tambah-produk').fadeIn(100);
                      $('#add-produk-btn').attr('onclick','hideAdd()');
                      $('#add-produk-btn').html('Tutup');
                      $('#body-tambah-kategori').fadeOut(100);
                      $('#add-kategori-btn').attr('onclick','showAddKat()');
                      $('#add-kategori-btn').html('Tambah Kategori');
                    }
                    function hideAdd(){
                      $('#body-tambah-produk').fadeOut(100);
                      $('#add-produk-btn').attr('onclick','showAdd()');
                      $('#add-produk-btn').html('Tambah Produk');
                    }
                    function tampilSubKat(idsub){
                      $('#subkategori-produk').html('')
                      var id_kategori = $('#kategori-produk').val();
                      $.ajax({
                        url:'subKategori',
                        type: 'POST',
                        data: {'idsubkat': id_kategori},
                        success: function(res){
                          var subkategori = JSON.parse(res);
                          $("#sub-category").html("");
                          $.each(subkategori, function(key, val){
                            var option = '<option value="'+val.id_kategori+'">'+val.nama_kategori+'</option>';
                            if(idsub!=null){
                              if(val.id_kategori==idsub){
                  //alert(idsub);
                  option = '<option value="'+val.id_kategori+'" selected="selected">'+val.nama_kategori+'</option>';
                }
              }
              $("#subkategori-produk").append(option);

            });
                          $('#subkategori-row').show();
                        }
                      });
                    }
                    function addProduk(){
                      var data = $('#form-add-produk').serialize();
                      $.ajax({
                        url:'addProduk',
                        type:'POST',
                        data:data,
                        success:function(result){
                          var res = JSON.parse(result);
                          alert(result);
                          if(res.error){
                            bootbox.dialog({
                              message: "Produk gagal ditambahkan",
                              title: "Status",
                              buttons: {
                                success: {
                                  label: "Ok!",
                                  className: "btn btn-danger",
                                },
                              }
                            });
                          }else{
                            bootbox.dialog({
                              message: "Produk Berhasil ditambahkan",
                              title: "Status",
                              buttons: {
                                success: {
                                  label: "Ok!",
                                  className: "btn btn-success",
                                },
                              }
                            });
                            updateView();
                          }
                        }
                      });
                    }
                    function showAddKat(){
                      $('#body-tambah-kategori').fadeIn(100);
                      $('#add-kategori-btn').attr('onclick','hideAddKat()');
                      $('#add-kategori-btn').html('Tutup');
                      $('#body-tambah-produk').fadeOut(100);
                      $('#add-produk-btn').attr('onclick','showAdd()');
                      $('#add-produk-btn').html('Tambah Produk');
                    }
                    function hideAddKat(){
                      $('#body-tambah-kategori').fadeOut(100);
                      $('#add-kategori-btn').attr('onclick','showAddKat()');
                      $('#add-kategori-btn').html('Tambah Kategori');
                    }
                    function addKategori(){
                      var data = $('#form-add-kategori').serialize();
                      $.ajax({
                        url:'addKategori',
                        type:'post',
                        data:data,
                        success:function(result){
                          alert(result);
                          var res = JSON.parse(result);
        // if(!res.error){
        //   bootbox.dialog({
        //     message: "Kategori Berhasil ditambahkan",
        //     title: "Status",
        //     buttons: {
        //       success: {
        //         label: "Ok!",
        //         className: "btn btn-success",
        //       },
        //     }
        //   });
        // }else{
        //   bootbox.dialog({
        //     message: res.message,
        //     title: "Status",
        //     buttons: {
        //       success: {
        //         label: "Ok!",
        //         className: "btn btn-success",
        //       },
        //     }
        //   });
        // }
      }
    });
                    }
                    function editProduk(rowindex){
                      cancelEdit();
                      var data = table.row(rowindex).data();
                      var status = data[8]  
                      if(status=='OK'){
                        $('#nonaktif').removeAttr('selected');
                        $('#kosong').removeAttr('selected');
                        $('#aktif').attr('selected','selected');
                        $('#tersedia').attr('selected','selected');
                      }else if(status=='kosong'){
                        $('#nonaktif').removeAttr('selected');
                        $('#tersedia').removeAttr('selected');
                        $('#aktif').attr('selected','selected');
                        $('#kosong').attr('selected','selected');    
                      }else if(status=='nonaktif'){
                        $('#aktif').removeAttr('selected');
                        $('#kosong').removeAttr('selected');
                        $('#nonakif').attr('selected','selected');
                        $('#tersedia').attr('selected','selected');
                      }else{
                        $('#aktif').removeAttr('selected');
                        $('#tersedia').removeAttr('selected');
                        $('#nonaktif').attr('selected','selected');
                        $('#kosong').attr('selected','selected');
                      }
                      $('#edit-field').show();
                      $('input[name=id_produk]').val(data[1]);
                      $('input[name=nama_produk]').val(data[2]);
                      $('input[name=harga_produk]').val(data[3]);
                      $('input[name=nominal_produk]').val(data[4]);
                      $('option').removeAttr('selected');
                      $('option[value="'+data[5]+'"]').attr('selected','selected');
                      tampilSubKat(data[6]);
                      $('option[value="'+data[7]+'"]').attr('selected','selected');
                      $('option[value="'+data[6]+'"]').attr('selected','selected');
                      $('#panel-add-produk').attr('class','panel panel-warning col-md-6');
                      $('#add-produk-heading').html('Edit Produk: '+data[1]+' <button id="add-produk-btn" class="btn btn-primary" onclick="hideAdd()">Hide</button>');
                      $('#add-btn').hide();
                      $('#edit-btn').show();
                      showAdd();
                    }
                    function updateProduk(){
                      var data = $('#form-add-produk').serialize();
                      $.ajax({
                        url:'updateProduk',
                        type:'POST',
                        data:data,
                        success:function(result){
                          var res = JSON.parse(result);
        //alert(result);
        if(res.error){
          bootbox.dialog({
            message: "Produk gagal ditambahkan",
            title: "Status",
            buttons: {
              success: {
                label: "Ok!",
                className: "btn btn-danger",
              },
            }
          });
        }else{
          bootbox.dialog({
            message: "Produk Berhasil ditambahkan",
            title: "Status",
            buttons: {
              success: {
                label: "Ok!",
                className: "btn btn-success",
              },
            }
          });
          cancelEdit();
          updateView();
        }
      }
    });
                    }
                    function cancelEdit(){
                      $('#body-tambah-produk').hide();
                      $('#panel-add-produk').attr('class','panel panel-default col-md-6');
                      $('#add-produk-heading').html('Tambah Produk <button id="add-produk-btn" class="btn btn-primary" onclick="showAdd()">Buka</button>');
                      $('#edit-btn').hide();
                      $('#add-btn').show();
                      updateView();
                    }
                    function updateView(){
                      reloadTable();
                      $('input').val('');
                      $('#default-kategori').attr('selected','true');
                      $('#subkategori-row').hide();
                      $('#subkategori-produk').html('');
                    }
                  </script>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal -->
          <div class="modal fade" id="logoutmodal" role="dialog">
            <div class="modal-dialog">

              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header" style="padding:20px 50px;">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4><i class="glyphicon glyphicon-off"></i></h4><br />        
                </div>
                <div class="modal-body" style="padding:20px 50px;">
                  <h3>Apakah anda yakin ingin keluar?</h3>  
                  <div class="col-md-12 row-centered">
                   <div class="col-md-6 row-centered medbuttong2az"><a href="logout"><i class="glyphicon glyphicon-ok"></i></a></div>
                   <div class="col-md-6 row-centered medbuttonr2az"><a href="" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i></a></div>
                 </div>
               </div>
               <div class="modal-footer">
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
