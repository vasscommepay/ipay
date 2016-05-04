<?php
use Illuminate\Http\Request;

Route::group(['middleware' => 'web'], function () {
    Route::get('/', function (Request $req) {
		if($req->session()->has('username')){
			return view('index');
		}else{
			return redirect('login');
		}	
	});
	Route::post('logedin','LoginC@logedin');
	Route::get('logout',function(){
		Auth::logout();
		Session::flush();
		return redirect('/');
	});
	Route::post('addMember','memberController@addMember');
	Route::post('addMemberAddress','memberController@addMemberAddress');
	Route::post('addMemberContact','memberController@addMemberContact');
	Route::post('sendMember','memberController@sendMember');
	Route::post('kategori', 'produkController@kategori');
	Route::post('subKategori', 'produkController@subKategori');
	Route::post('form', 'produkController@form');
	Route::post('produk', 'produkController@produk');
	Route::post('getDaftarTransaksi','TransactionController@getDaftarTransaksi');
	Route::get('getDownlink','memberController@getDownlink');
	Route::post('quickCheckout','TransactionController@quickCheckOut');
	Route::post('addToCart','TransactionController@addToCart');
	Route::post('checkOutCart','TransactionController@checkOutCart');
	Route::get('getCart','TransactionController@getCart');
	Route::post('removeFromCart','TransactionController@removeFromCart');
	Route::post('tambahSaldo','memberController@tambahSaldo');
	Route::post('addProduk','produkController@addProduk');
	Route::post('addKategori','produkController@addKategori');
	Route::post('updateProduk','produkController@updateProduk');
	Route::post('getMutasi','TransactionController@getMutasi');
	Route::post('getSupplier','produkController@getSupplier');
	Route::post('addSupplier','produkController@addSupplier');
	Route::post('assignSup','produkController@assignSup');
	Route::post('submit-kontak-supplier','produkController@addKontakSup');
	Route::post('submit-address-supplier','produkController@addAddressSup');
	Route::post('cekRespon','TransactionController@cekRespon');
	Route::post('loadDownlink','memberController@loadDownlink');
	Route::post('loadWilayah','memberController@loadWilayah');
	Route::post('submit-harga-agen','produkController@submitHargaAgen');
	Route::post('submit-harga-wilayah','produkController@submitHargaWilayah');
	Route::post('get-all-kategori','produkController@allKategori');
	Route::post('cekHarga','TransactionController@cekHarga');
	Route::post('update-harga-downlink','produkController@updateHargaDownlink');
	Route::post('cekOrder','TransactionController@cekOrder');
	Route::get('get-saldo','memberController@getSaldo');
	Route::get('get-histori-saldo','memberController@getHistoriSaldo');
	Route::post('req-tambah-saldo','memberController@requestTambahSaldo');
	Route::post('get-notif','memberController@getNotif');
	// Route::get('produk-page',function(){
	// 	return view('produk');
	// });
});

Route::post('upload-foto-kategori','produkController@uploadKategoriImage');
Route::get('get_prov','AddressController@getProvinsi');
Route::get('get_wil','AddressController@getWilayah');
Route::post('get_kec','AddressController@getKecamatan');
Route::post('get_kab','AddressController@getKabupaten');
Route::post('register','registerController@register');
Route::post('cekUsername','registerController@cekUsername');
Route::get('daftarregistrasi', function () {
    return view('daftarregistrasi');
});
Route::get('login', function () {
    return view('login');
});
