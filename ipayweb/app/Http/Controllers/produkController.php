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
		$session = Session::get('session');
		$uplink = Session::get('uplink_id');
		$id_produk = Request::input('idproduk');
		$form3 = array('session'=>$session,'uplink'=>$uplink, 'product_id'=>$id_produk);
		$this->params = $form3;
		$this->url = 'produk/getProduk';
		$this->sendPostRequest();
	}
	public function form(){
		$session = Session::get('session');
		$id_kategori = Request::input('id_kategori');
		$form4 = array('session'=>$session, 'input_name'=>$id_kategori, 'input_type'=>$inputtype, 'input_label'=>$inputlabel);
		$this->params = $form4;
		$this->url = 'produk/getForm';
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
