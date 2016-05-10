<script type="text/javascript">
   $(document).ready(function(){
    $.ajax({
        url:'kategori',
        type: 'POST',
        success: function(res){
            var kategori = JSON.parse(res);
            $.each(kategori, function(key, val){
                var idkat = val.id_kategori;
                var namakat = val.nama_kategori;
                $("#allCategory").append('<li><a href="#subkategori"><div id="general" class="col-md-3 col-sm-3 col-xs-3 bullet tile slideTextRight greymenu col-centered" onclick="tampilSubKat(&#39'+idkat+'&#39)"><div><p>'+namakat+'</p></div><div><p><img src="images/kategori/'+idkat+'.png" /></p></div></div></a></li>');
            });
        }
    });
		var updateKatRightLeftButtons = function() {
    if (306 > (parseInt($('#kat_category_list ul').css('marginLeft')) * -1)) {
        $('.kat-left-button').hide();
    } else {
        $('.kat-left-button').show();
    }
    if ((($('#kat_category_list ul').width() * $('#kat_category_list ul').length) - 500) < (parseInt($('#kat_category_list ul').css('marginLeft')) * -1)) {
        $('.kat-right-button').hide();
    } else {
        $('.kat-right-button').show();
    }
};
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
updateKatRightLeftButtons();
$('.kat-right-button').click(function() {
    updateRightLeftButtons();
    if ($(this).is(':visible'))
    $('#kat_category_list ul').animate({
        marginLeft: "-=306px"
    }, "fast", updateKatRightLeftButtons);
});
$('.kat-left-button').click(function() {
    updateRightLeftButtons();
    if ($(this).is(':visible'))
    $('#kat_category_list ul').animate({
        marginLeft: "+=306px"
    }, "fast", updateKatRightLeftButtons);
});
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
});
</script>

<div id="transpage" class="row row-centered">
    <div id="transpagewrapp" class="col-md-12 dashboard">
<div id="transaction_category" class="col-md-12 col-sm-12 col-xs-12 row-centered">
<div class="col-md-12 col-xs-12 trs scrollcat">
<h2 class="pull-left">CATEGORY</h2>
<div id="kat_category_list" class="col-7 col-sm-7 col-xs-7 scrollcat col-centered">
<ul id="allCategory">

</ul>
</div>
<a class="kat-left-button"><i class="glyphicon glyphicon-chevron-left"></i></a>
<a class="kat-right-button"><i class="glyphicon glyphicon-chevron-right"></i></a>
</div>
</div>

<div id="product_list" class="col-md-12 col-sm-12 col-xs-12 row-centered">
<div id="subkategori" class="col-md-12 col-xs-12 trs scrollcat">
<h2 class="pull-left">PRODUCTS</h2>
<div id="category_list" class="col-7 col-sm-7 col-xs-7 scrollcat col-centered">
<ul id="allSubCategory">

</ul>
</div>
<a class="left-button"><i class="glyphicon glyphicon-chevron-left"></i></a>
<a class="right-button"><i class="glyphicon glyphicon-chevron-right"></i></a>
<a href="#" class="close-button"><i class="glyphicon glyphicon-remove"></i></a>
</div>

</div>

        <div id="midform" class="col-md-7 col-centered">
            <div id="aform" class="col-md-12 col-centered" align="center">
			<h3>PEMBAYARAN <span id="nama-produk-pembayaran"></span></h3>
                <form id="checkout-form" class="form-horizontal" method="post" action="">

                    <div id="formproduk" class="col-sm-12">

    <!-- <div id="produkinput" class="form-group">
        <label class="col-md-5 control-label">Pilih Produk</label>
        <select id="produk_list" name="produklist" class="col-md-7">
            <option value="null">Pilih Produk</option>
        </select>
    </div> 
    <div class="form-group">
        <label class="col-md-5 control-label">Jenis provider</label><input type="text" class="col-md-7" /></div>
        <div class="form-group"> -->
                    </div>
                    <div align="center">
                        <h2  id="harga" style="color:green;display: "></h2>
                    </div>
                    <!-- <div class="col-md-3"></div> -->       
                    <button type="button" onclick="addToCart()" class="col-sm-6 trs"><i class="glyphicon glyphicon-shopping-cart"></i> Add To Cart</button>
					<button type="button" onclick="checkout()" class="col-sm-6 chckout trs"><i class="glyphicon glyphicon-usd"></i> Checkout</button>
            </form>
			
			</div>

        
					<div id="defsurface" class="col-md-12 col-xs-12 col-centered trs">
<div class="row-centered"><i class="glyphicon glyphicon-th"></i></div>
<div class="row-centered"><p class="col-md-5 col-sm-5 col-xs-5 col-centered">Pilih Kategori dan Produk untuk memulai pembayaran.</p></div>
</div>
    </div>
</div>
    
</div>
</div>
<script type="text/javascript">
    $('input[name=tujuan]').change(function(){
        cekHarga();
    });
    function tampilSubKat(id_kategori){
        $.ajax({
            url:'subKategori',
            type: 'POST',
            data: {'idsubkat': id_kategori},
            success: function(res){
                var subkategori = JSON.parse(res);
                $("#allSubCategory").html("");
                $.each(subkategori, function(key, val){
                    var idsub = val.id_kategori;
                    var namasub = val.nama_kategori;
                    var subkat = val.id_super_kategori;
                    $("#allSubCategory").append('<li><a href="#aform"><div id="general" class="bullet whitemenu tile slideTextRight" onclick="isiform(&#39'+idsub+'&#39,&#39'+namasub+'&#39)"><div><p>'+namasub+'</p></div><div><p><img src="images/'+namasub+'.png" /></div></div>');
                });
            }
        });
    }
    function cekHarga(){
        //alert('cek harga');
        var data = $('#checkout-form').serialize();
        var tujuan = $('input[name=tujuan]').val();
        if(tujuan!=''){
            $.ajax({
                url:'cekHarga',
                data:data,
                type:'post',
                success:function(result){
                    //alert(result);
                    var res = JSON.parse(result);
                    if(!res.error){
                        var harga = setComma(res.harga);
                        if(res.kosong){
                            $('#harga').html('Maaf produk sedang kosong');
                        }else if(!res.aktif){
                            $('#harga').html('Maaf produk sedang tidak dijual');
                        }else{
                            if(res.tipe=="postpaid"){
                                var reff = res.ref.reff;
                                var tagihan = reff.tagihan;
                                var admin = reff.admin;
                                var ket = reff.reff.substring(0,reff.reff.indexOf('tag')).toUpperCase();
                                $('#harga').html(ket+'<br>Tagihan: Rp '+tagihan+',-<br>Admin: Rp '+admin+',-<br>Rp Total: '+harga+',-');
                            }else{
                                $('#harga').html('Rp '+harga+',-');
                            }
                            
                        }
                    }
                }
            });
        }
    }

    function tampilNominal(id_kategori,label){
        $.post('produk',{'id_kategori': id_kategori},function(success){
            var list_produk = JSON.parse(success);
            //alert(success); 
            $("#produk_list").html("");
            $.each(list_produk,function(key,val){
                var idpro = val.id;
                var nominal = setComma(val.nominal);
                var nama = val.nama;
                
                if(label=='Nominal'){
                     $("#select-field").append('<option value="'+idpro+'">'+nominal+'</option>');
                }else{
                    $("#select-field").append('<option value="'+idpro+'">'+nama+'</option>');
                }
               
            });
        });
    }
    function getProduk(id_kategori){
        $.post('produk',{'id_kategori': id_kategori},function(success){
            var list_produk = JSON.parse(success);
            alert(success); 
            $("#produk_list").html("");
            $.each(list_produk,function(key,val){
                var idpro = val.id;
                var nominal = setComma(val.nominal);
                var nama = val.nama;
                $('#formproduk').append('<input name="produk" type="hidden" value="'+idpro+'">');
            });
        });
    }

    function isiform(id_kategori,namasub){

        $.ajax({
            url:'form',
            type: 'POST',
            data:{"id_kategori":id_kategori},
            success: function(res){
                $('#nama-produk-pembayaran').html(namasub);
                var label = JSON.parse(res);
                //$("#formproduk").html("");
                //alert(res);
                $("#formproduk").html("");
                $("#harga").html("");
                //alert (label.length);
                if(label.length>1){
                    $.each(label, function(key, val){
                        var inputname = val.input_name;
                        var inputtype = val.input_type;
                        var inputlabel = val.input_label;
                        var input = '<input type="'+inputtype+'" name="'+inputname+'" class="form-control" onchange="cekHarga()">';
                        if(inputtype=="select"){
                            input = '<select class="form-control" id="select-field" name="'+inputname+'" onchange="cekHarga()">';
                            tampilNominal(id_kategori,inputlabel);
                        }
                        if(inputname!='quantity'){
                            $("#formproduk").append('<div class="form-group"><label>'+inputlabel+'</label>'+input+'</div>');
                        }                
                    });
                }else{
                    $.each(label, function(key, val){
                        var inputname = val.input_name;
                        var inputtype = val.input_type;
                        var inputlabel = val.input_label;
                        var input = '<input type="'+inputtype+'" name="'+inputname+'" class="form-control" onchange="cekHarga()">';
                        getProduk(id_kategori);
                        if(inputname!='quantity'){
                            $("#formproduk").append('<div class="form-group"><label>'+inputlabel+'</label>'+input+'</div>');
                        }                
                    });
                }
                $("input[name='tujuan']").keyup(function() {
                    $("input[name='tujuan']").val(this.value.match(/[0-9]*/));
                });
            }
        });
       // tampilNominal();
   }

   function checkout(){
     var data = $("#checkout-form").serialize();
     $.ajax({
        url:'quickCheckout',
        type:'post',
        data:data,
        success:function(result){
            //alert(result);
            var res = JSON.parse(result);
            if(res.error){
                //alert(res.message);
            }else{
                //alert(res.status);
                $('#mainmenu').load('pages/dashboard.html');
                $('#switcher').remove();
                 //alert("Thanks for visiting!");
                var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
                $("head").append(cssLink); 
            }   
        }
        });
   }
   function addToCart(){
    var data = $("#checkout-form").serialize();
    $.ajax({
        url:"addToCart",
        data:data,
        type:'post',
        success:function(result){
            // bootbox.dialog({
            //   message: "Produk telah ditambahkan",
            //   title: "Tambah keranjang belanja",
            //   buttons: {
            //     success: {
            //       label: "Ok!",
            //       className: "btn btn-success",
            //     },
            //   }
            // });

            var cart_count = $('#cart-count').html();
            $('#cart-count').html(+cart_count + 1);
            $("input").val("");
        }
    });
   }
</script>