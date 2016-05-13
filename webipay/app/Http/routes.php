<?php
use Illuminate\Http\Request;

Route::group(['middleware' => 'web'], function () {
	Route::get('/', function (Request $req) {
		if($req->session()->has('username')){
			return view('index');
		}else{
			/*Session::put('username',"ipay");
            Session::put('session',"ipay");
            Session::put('level',"3");
            Session::put('member_id',"4");
            Session::put('uplink_id',"3");*/
            Session::put('username','');
            Session::put('session','');
            Session::put('level','0');
            Session::put('member_id','1');
            Session::put('uplink_id','1');
			return view('index');
			//return redirect('index');
		}	
	});
	Route::post('logedin','LoginC@logedin');
	Route::get('logout',function(){
		Auth::logout();
		Session::flush();
		return redirect('index');
	});
	Route::post('addMember','memberController@addMember');
	Route::post('addMemberAddress','memberController@addMemberAddress');
	Route::post('addMemberContact','memberController@addMemberContact');
	Route::post('sendMember','memberController@sendMember');
	Route::post('kategori','produkController@kategori');
	Route::post('subKategori','produkController@subKategori');
	Route::post('form','produkController@form');
	Route::post('produk','produkController@produk');
	Route::post('tambahSaldo','memberController@tambahSaldo');
	Route::get('getDownlink','memberController@getDownlink');
	Route::post('getDaftarTransaksi','TransactionController@getDaftarTransaksi');
	Route::post('quickCheckout','TransactionController@quickCheckOut');
	Route::post('addToCart','TransactionController@addToCart');
	Route::post('checkOutCart','TransactionController@checkOutCart');
	//Route::post('checkOutCartNon','TransactionController@checkOutCartNon');
	Route::get('getCart','TransactionController@getCart');
	Route::post('removeFromCart','TransactionController@removeFromCart');
	Route::post('quickCheckout','TransactionController@quickCheckOut');
});
Route::get('get_prov','AddressController@getProvinsi');
Route::get('get_wil','AddressController@getWilayah');
Route::post('get_kec','AddressController@getKecamatan');
Route::post('get_kab','AddressController@getKabupaten');
Route::post('register','registerController@register');
Route::post('cekUsername','registerController@cekUsername');
/*Route::get('trans_now', function () {
    return view('trans_now');
});*/
Route::get('pendaftaran_afiliasi', function () {
    return view('public/pages/pendaftaran_afiliasi');
});
Route::get('index', function () {
    return view('index');
});