<?php
namespace App\Http\Controllers;
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
    	$username = Request::input('susername');
    	$user = array('username'=>$username);
    	$this->params = $user;
    	$this->url = 'users/cek-username';
    	$this->sendPostRequest();
    }
    function register(){
    	$username = Request::input('susername');
    	$password = Request::input('spassword');
    	//$cpassword = Request::input('confpassword');
    	$noreg = Request::input('noreg');
		$form = array('username'=>$username,'password'=>$password,'reg_num'=>$noreg);
		$this->params = $form;
		$this->url = 'users/add-new-users';
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
