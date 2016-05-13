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
		if (Session::has('session')) {
			$this->params = $form1;
			$this->url = 'produk/getKategori';
			$this->sendPostRequest();
		}
		else{
			$this->params = $form1;
			$this->url = 'nonagen/getKategori';
			$this->sendPostRequest();
		}
	}
	public function subKategori(){
		$id_kategori = Request::input('idsubkat');
		$session = Session::get('session');
		$form2 = array('session'=>$session, 'id_kategori'=>$id_kategori);
		if (Session::has('session')){
			$this->params = $form2;
			$this->url = 'produk/getSubKategori';
			$this->sendPostRequest();
		}
		else{
			$this->params = $form2;
			$this->url = 'nonagen/getSubKategori';
			$this->sendPostRequest();
		}
		
	}
	public function produk(){
		$id_kategori = Request::input('id_kategori');
		$session = Session::get('session');
		$uplink = Session::get('uplink_id');
		if (Session::has('session')){
			$this->params = array('session'=>$session,'uplink'=>$uplink,'kategori'=>$id_kategori);
			$this->url = 'produk/getProduk';
			$this->sendPostRequest();
		}
		else{
			$this->params = array('uplink'=>$uplink,'kategori'=>$id_kategori);
			$this->url = 'nonagen/getProduk';
			$this->sendPostRequest();
		}
	}
	public function form(){
		$id_kategori = Request::get('id_kategori');
		$session = Session::get('session');
		if (Session::has('session')) {
			$this->params = array('id_kategori'=>$id_kategori,'session'=>$session);
			$this->url = 'produk/getForm';
			$this->sendPostRequest();
		}
		else{
			$this->params = array('id_kategori'=>$id_kategori,'session'=>$session);
			$this->url = 'nonagen/getForm';
			$this->sendPostRequest();
		}
	}
		
	public function sendProduk(){
		$form1 = Session::get('form1');
		$form2 = Session::get('form2');
		//$form3 = Session::get('form3');
		//$form4 = Session::get('form4');
		if (Session::has('session')) {
			$memberData = array_merge($form1,$form2,$form3,$form4);
			$this->params = $memberData;
			$this->url = 'produk/addProduk';
			$this->sendPostRequest();
		}
		else{
			$memberData = array_merge($form1,$form2,$form3,$form4);
			$this->params = $memberData;
			$this->url = 'nonagen/addProduk';
			$this->sendPostRequest();
		}
	}
	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
}
