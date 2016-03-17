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
});
Route::get('get_prov','AddressController@getProvinsi');
Route::post('get_kec','AddressController@getKecamatan');
Route::post('get_kab','AddressController@getKabupaten');
Route::get('login', function () {
    return view('login');
});
