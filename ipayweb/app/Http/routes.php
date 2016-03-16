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
});
Route::post('addMember','memberController@addMember');
Route::get('login', function () {
    return view('login');
});
