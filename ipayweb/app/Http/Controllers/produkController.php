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
	public function assignSup(){
		//Session::forget('supplier_produk');
		$params = Request::all();
		Session::put('supplier_produk',$params);
		echo json_encode($params);
	}

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

	public function submitHargaAgen(){
		//Session::forget('harga_agen');
		$harga = Request::all();
		Session::put('harga_agen',$harga);
		echo json_encode($harga);
	}
	public function submitHargaWilayah(){
		//Session::forget('harga_wilayah');
		$harga = Request::all();
		Session::put('harga_wilayah',$harga);
		echo json_encode($harga);
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
		$harga_wilayah = Session::get('harga_wilayah');
		$params = array('session'=>$session,'idproduk'=>$id,'namaproduk'=>$nama,'harga_beli'=>$harga_beli,'kategori_produk'=>$kategori_produk,'nominal'=>$nominal,'tipe'=>$tipe);
		$this->params = $params;
		if(Session::has('supplier_produk')){
			$supplier = Session::get('supplier_produk');
			$params = array_merge($params,$supplier);
		}
		if(Session::has('harga_agen')){
			$harga_agen = Session::get('harga_agen');
			$params = array_merge($params,$harga_agen);
		}
		if(Session::has('harga_wilayah')){
			$harga_wilayah = Session::get('harga_wilayah');
			$params = array_merge($params,$harga_wilayah);
		}
		$this->params = $params;
		echo json_encode($this->params);
		//$result = $this->sendPostRequest();
		// $res = json_decode($result);
		// if(count($res)!=0){
		// 	if(!$res->error){
		// 		Session::forget('harga_agen');
		// 		Session::forget('harga_wilayah');
		// 		Session::forget('supplier_produk');
		// 	}
		// }
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
	public function addKontakSup(){
		$kontak = Request::all();
		Session::put('sup_kontak',$kontak);
		echo 'kontak berhasil ditambahkan';
	}
	public function addAddressSup(){
		$address = Request::all();
		Session::put('sup_address',$address);
		echo 'alamat berhasil ditambahkan';
	}
	public function addSupplier(){
		$session = array('session'=>Session::get('session'));
		$data = Request::all();
		$address = Session::get('sup_address');
		$kontak = Session::get('sup_kontak');
		$prop = array('address'=>$address,'kontak'=>$kontak);
		$params = array_merge($data,$prop,$session);
		$this->params = $params;
		$this->url = 'produk/addSupplier';
		$this->sendPostRequest();
		//echo json_encode($params);
	}
	public function allKategori(){
		$session = Session::get('session');
		$this->params = array('session'=>$session,'all'=>true);
		$this->url = 'produk/getKategori';
		$this->sendPostRequest();
	}

	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
		return $result;
	}
}
