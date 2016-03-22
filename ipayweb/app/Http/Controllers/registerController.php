<?php
namespace App\Http\Controllers;
//use Illuminate\Http\Request;
//use App\Http\Requests;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;
//use Session;

class registerController extends Controller
{
	private $url;
	private $params;

    function cekUsername(){
    	$username = Request::input('username');
    	$user = array('username'=>$username);
    	$this->params = $user;
    	$this->url = 'users/cek-username';
    	$this->sendPostRequest();
    }
    function register(){
    	$username = Request::input('username');
    	$password = Request::input('password');
    	$cpassword = Request::input('confpassword');
    	$noreg = Request::input('noreg');
		$form = array('username'=>$username,'password'=>$password,'confpassword'=>$cpassword,'noreg'=>$noreg);
		$this->params = $form;
		$this->url = 'users/add-new-user';
		$this->sendPostRequest();
    }
    private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
}
