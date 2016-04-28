<?php 
namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;
use Session;

class produkController extends Controller {

    private $url;
	private $params;

	//
	public function kategori(){
		$session = Session::get('session');
		$uplink = Session::get('uplink_id');
		$form1 = array('session'=>$session,'uplink'=>$uplink);
		$this->params = $form1;
		$this->url = 'produk/getKategori';
		$this->sendPostRequest();
	}
	public function subKategori(){
		$id_kategori = Request::input('idsubkat');
		$session = Session::get('session');
		$form2 = array('session'=>$session, 'id_kategori'=>$id_kategori);
		$this->params = $form2;
		$this->url = 'produk/getSubKategori';
		$this->sendPostRequest();
	}
	public function produk(){
		$this->url = 'produk/getProduk';
		$id_kategori = Request::input('id_kategori');
		$session = Session::get('session');
		$uplink = Session::get('uplink_id');
		$this->params = array('session'=>$session,'uplink'=>$uplink,'kategori'=>$id_kategori);
		$this->sendPostRequest();
	}
	public function form(){
		$this->url = 'produk/getForm';
		$id_kategori = Request::get('id_kategori');
		$session = Session::get('session');
		$this->params = array('id_kategori'=>$id_kategori,'session'=>$session);
		$this->sendPostRequest();
	}
	public function sendProduk(){
		$form1 = Session::get('form1');
		$form2 = Session::get('form2');
		$form3 = Session::get('form3');
		$form4 = Session::get('form4');
		$memberData = array_merge($form1,$form2,$form3,$form4);
		$this->params = $memberData;
		$this->url = 'produk/addProduk';
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
