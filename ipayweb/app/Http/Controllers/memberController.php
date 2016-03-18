<?php 
namespace App\Http\Controllers;
//use Illuminate\Http\Request;
//use App\Http\Requests;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;
use Session;
class memberController extends Controller {

    private $url;
	private $params;

	public function addMember(){
		$session = Session::get('session');
		$mnama = Request::input('nama');
		$tgl_lahir = Request::input('tgl_lahir');
		$jenis_kelamin = Request::input('jenis_kelamin');
		$level = Session::get('level');
		$mktp = Request::input('noktp');
		$mnpwp = Request::input('npwp');
		$form1 = array('session'=>$session,'nama'=>$mnama,'identity_number'=>$mktp,'npwp'=>$mnpwp,'tanggal_lahir'=>$tgl_lahir,'jenis_kelamin'=>$jenis_kelamin,'level_member'=>$level);
		if($level==0){
			$wilayah = Request::input('wilayah');
			$form1 = array('session'=>$session,'nama'=>$mnama,'identity_number'=>$mktp,'npwp'=>$mnpwp,'tanggal_lahir'=>$tgl_lahir,'jenis_kelamin'=>$jenis_kelamin,'level_member'=>$level,'wilayah'=>$wilayah);
		}
		echo json_encode($form1);
		Session::put('form1',$form1);
	}
	public function addMemberAddress(){
		$jalan = Request::input('jalan');
		$kecamatan = Request::input('kec');
		$kota = Request::input('kab');
		$provinsi = Request::input('prov');
		$keterangan = Request::input('keterangan');
		$form2 = array('jalan'=>$jalan,'kec'=>$kecamatan,'kab'=>$kota,'prov'=>$kota,'ket'=>$keterangan);
		Session::put('form2',$form2);
		echo json_encode($form2);
	}
	public function addMemberContact(){
		$telp = Request::input('telp');
		$email = Request::input('email');
		$form3 = array('telp'=>$telp,'email'=>$email);
		Session::put('form3',$form3);
	}
	public function sendMember(){
		$form1 = Session::get('form1');
		$form2 = Session::get('form2');
		$form3 = Session::get('form3');
		$memberData = array_merge($form1,$form2,$form3);
		$this->params = $memberData;
		$this->url = 'member/newMember';
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
