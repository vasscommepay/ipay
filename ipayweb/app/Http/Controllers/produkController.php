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

	public function addProduk(){
		$this->url = 'produk/addProduk';
		$session = Session::get('session');
		$id = Request::input('id_produk');
		$nama = Request::input('nama_produk');
		$harga_beli = Request::input('harga_produk');
		$kategori_produk = Request::input('kategori_produk');
		$nominal = Request::input('nominal_produk');
		$tipe = Request::input('tipe_produk');
		$this->params = array('session'=>$session,'idproduk'=>$id,'namaproduk'=>$nama,'harga_beli'=>$harga_beli,'kategori_produk'=>$kategori_produk,'nominal'=>$nominal,'tipe'=>$tipe);
		//echo json_encode($this->params);
		$this->sendPostRequest();
	}

	public function updateProduk(){
		$session = array('session'=>Session::get('session'));
		$params = array_merge($session,Request::all());
		//echo json_encode($params);
		$this->params = $params;
		$this->url = 'produk/updateProduk';
		$this->sendPostRequest();
	}
	public function addKategori(){
		$session = array('session'=>Session::get('session'));
		$params = array_merge(Request::all(),$session);
		//echo json_encode($params);
		$this->params = $params;
		$this->url = 'produk/addKategori';
		$this->sendPostRequest();
	}

	public function getSupplier(){
		$this->params = array('session'=>Session::get('session'));
		$this->url = 'produk/getSupplier';
		$this->sendPostRequest();
	}
	// public function produk(){
	// 	$session = Session::get('session');
	// 	$uplink = Session::get('uplink_id');
	// 	$id_produk = Request::input('idproduk');
	// 	$form3 = array('session'=>$session,'uplink'=>$uplink, 'product_id'=>$id_produk);
	// 	$this->params = $form3;
	// 	$this->url = 'produk/getProduk';
	// 	$this->sendPostRequest();
	// }
	// public function form(){
	// 	$session = Session::get('session');
	// 	$id_kategori = Request::input('id_kategori');
	// 	$form4 = array('session'=>$session, 'input_name'=>$id_kategori, 'input_type'=>$inputtype, 'input_label'=>$inputlabel);
	// 	$this->params = $form4;
	// 	$this->url = 'produk/getForm';
	// 	$this->sendPostRequest();
	// }

	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
}
