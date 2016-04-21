<?php
namespace App\Http\Controllers;
use Request;
use Session;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;

class LoginC extends Controller
{
    private $params;
    private $url;

    function logedin(Request $req){
        
        $username = Request::input('username');
        $password = Request::input('password');

        $this->url = "login";
        $params = array("username"=>$username,"password"=>$password);
        $this->params = $params;
                                                                                                                      
        $result = $this->sendPostRequest();
        $res = json_decode($result);
        if(count($res)!=0){
            if($res->isLogin){
                $session = $res->session;
                $level = $res->level;
                $member_id = $res->member_id;
                $uplink = $res->uplink;
                Session::put('username',$username);
                Session::put('session',$session);
                Session::put('level',$level);
                Session::put('saldo',$res->saldo);
                Session::put('komisi',$res->komisi);
                Session::put('member_id',$member_id);
                Session::put('nama',$res->nama);
                Session::put('uplink_id',$uplink);
                return redirect('/');
            } else {
                return redirect('login')->with('status','failed');
            }
        }else{
            return redirect('login')->with('status','failed');
        }
	}

    private function sendPostRequest(){
        $url = $this->url;
        $params = $this->params;
        $sender = new PostSender($url,$params);
        $result = $sender->sendRequest();
        return $result;
    }
}
