<?php
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::group(['middleware' => 'web'], function () {
    Route::get('/', function (Request $req) {
    	//echo $req->session()->get('username');
		if($req->session()->has('username')){
			return view('index');
		}else{
			//echo Session::get('username');
			//echo $req->session()->get('username');
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

Route::get('login', function () {
    return view('login');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/