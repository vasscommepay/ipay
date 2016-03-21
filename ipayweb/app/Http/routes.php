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
});
Route::get('get_prov','AddressController@getProvinsi');
Route::get('get_wil','AddressController@getWilayah');
Route::post('get_kec','AddressController@getKecamatan');
Route::post('get_kab','AddressController@getKabupaten');
Route::post('register','registerController@register');
Route::get('daftarregistrasi', function () {
    return view('daftarregistrasi');
});
Route::get('login', function () {
    return view('login');
});
