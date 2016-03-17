<?php 
namespace App\Http\Controllers;
//use Illuminate\Http\Request;
//use App\Http\Requests;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;
use Session;
class AddressController extends Controller {

    private $url;
	private $params;

	public function getProvinsi(){
		$this->url = 'address/provinsi';
		$this->sendGetRequest();
	}
	public function getKabupaten(){
		$this->url = 'address/getKota';
		$id_prov = Request::input('id_prov');
		$this->params = array('id_prov'=>$id_prov);
		$this->sendPostRequest();
	}
	public function getKecamatan(){
		$this->url = 'address/getKecamatan';
		$kab = Request::input('id_kab');
		$this->params = array('id_kab'=>$kab);
		$this->sendPostRequest();
	}
	private function sendGetRequest(){
		$url = $this->url;
		$sender = new GetSender($url);
		$result = $sender->sendRequest();
		echo $result;
	}
	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
}
