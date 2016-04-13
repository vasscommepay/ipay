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
                $("#allCategory").append('<li><a href="#subkategori"><div id="general" class="bullet greymenu tile slideTextRight" onclick="tampilSubKat(&#39'+idkat+'&#39)"><div><p>'+namakat+'</p></div><div><p><img src="images/'+namakat+'.png" /></p></div></div></a></li>');
            });
        }
    });
});
</script>

<div id="transpage" class="row row-centered">
    <div id="transpagewrapp" class="col-md-12 dashboard">
        <div id="quicktranspagehead" class="row"><img src="images/cashiericon2.png" /><span>Transaksi Sekarang</span></div>
        <div id="transline" class="row"></div>

        <div id="categoryleft" class="row pull-left">
            <ul id="allCategory">

            </ul>
            <div class="downpointer2 row-centered"><i class="transparent glyphicon glyphicon-arrow-down"></i></div>
        </div>

        <div id="subkategori" class="col-md-3">
            <ul id="allSubCategory">
            </ul>
            <div class="downpointer2 row-centered"><i class="transparent glyphicon glyphicon-arrow-down"></i></div>
        </div>

        <div id="midform" class="col-md-7 col-centered">
            <div id="aform" class="col-md-12 col-centered">
                <form id="checkout-form" class="form-horizontal" method="post" action="">

                    <div id="formproduk">

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

                    <div class="col-md-3"></div>

                    <button type="button" onclick="checkout()" class="col-md-3 btn btn-default"><i class=""></i>Checkout</button>
                    <button type="button" class="col-md-3 btn btn-default"><i class=""></i>Add To Cart</button>
            </div>
        </form>
    </div>
</div>

</div>
</div>
<script type="text/javascript">
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
                    $("#allSubCategory").append('<li><a href="#aform"><div id="general" class="bullet whitemenu tile slideTextRight" onclick="isiform(&#39'+idsub+'&#39)"><div><p>'+namasub+'</p></div><div><p><img src="images/'+namasub+'.png" /></div></div></a></li>');
                });
            }
        });
    }
    function tampilNominal(id_kategori){
        $.post('produk',{'id_kategori': id_kategori},function(success){
            var list_produk = JSON.parse(success);
            //alert(success); 
            $("#produk_list").html("");
            $.each(list_produk,function(key,val){
                var idpro = val.product_id;
                var nominal = setComma(val.nominal);
                $("#select-field").append('<option value="'+idpro+'">'+nominal+'</option>');
            });
        });
    }

    function isiform(id_kategori){

        $.ajax({
            url:'form',
            type: 'POST',
            data:{"id_kategori":id_kategori},
            success: function(res){
                var label = JSON.parse(res);
                //$("#formproduk").html("");
                //alert(res);
                $("#formproduk").html("");
                $.each(label, function(key, val){
                    var inputname = val.input_name;
                    var inputtype = val.input_type;
                    var inputlabel = val.input_label;

                    var input = '<input type="'+inputtype+'" name="'+inputname+'" class="col-md-7">';
                    if(inputtype=="select"){
                        input = '<select class="col-md-7" id="select-field" name="'+inputname+'">';
                        tampilNominal(id_kategori);
                    }
                    $("#formproduk").append('<div class="form-group"><label class="col-md-5 control-label">'+inputlabel+'</label>'+input+'</div>');
                });
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
                $('#mainmenu').load('pages/home.html');
                $('#switcher').remove();
                 //alert("Thanks for visiting!");
                var cssLink = $("<link rel='stylesheet' id='switcher' type='text/css' href='css/default.css'>");
                $("head").append(cssLink); 
                $("#cartmodal").click(function(){
                    $("#carts").modal();
                });
            }   
        }
        });
   }
</script>