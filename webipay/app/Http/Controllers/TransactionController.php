<?PHP namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;
use Session;

class TransactionController extends BaseController {
	private $url;
	private $params;

	public function getDaftarTransaksi(){
		$session = Session::get('session');
		$member = Session::get('member_id');
		$this->params = array("session"=>$session,"id_member"=>$member);
		$this->url = 'transaction/getTransaction';
		$this->sendPostRequest();
	}	
	public function addToCart(){
		$id_produk = Request::input('produk');
		$tujuan = Request::input('tujuan');
		$quantity = Request::input('quantity');
		//$produk = array("id_produk"=>$id_produk,"qty"=>$quantity,"tujuan"=>$tujuan);
		$produk = array("id_produk"=>$id_produk,"tujuan"=>$tujuan);
		$cart = array();
		if(Session::has('daftar_produk')){
			$cart = Session::get('daftar_produk');
		};
		array_push($cart,$produk);
		Session::put('daftar_produk',$cart);
	}
	public function quickCheckOut(){
		$session = Session::get('session');
		$id_produk = Request::input('produk');
		$tujuan = Request::input('tujuan');
		$quantity = Request::input('quantity');
		$username = Session::get('username');
		$member = Session::get('member_id');
		$uplink = Session::get('uplink_id');
		//$produk = array("id_produk"=>$id_produk,"qty"=>$quantity,"tujuan"=>$tujuan);
		$produk = array("id_produk"=>$id_produk,"tujuan"=>$tujuan);
		$prod = array();
		array_push($prod,$produk);
		//echo json_encode($prod);
		if (Session::get('session')) {
			$this->url = 'transaction/transaksi';
			$this->params = array("session"=>$session,"id_uplink"=>$uplink,"id_member"=>$member,"username"=>$username,"prod"=>$prod);
			//$this->params = array("session"=>$session,"id_uplink"=>$uplink,"id_member"=>$member,"prod"=>$prod);
			$this->sendPostRequest();
		}
		else{
			$this->url = 'nonagen/transaksi';
			$this->params = array("id_uplink"=>$uplink,"id_member"=>$member,"username"=>$username,"prod"=>$prod);
			//$this->params = array("id_uplink"=>$uplink,"id_member"=>$member,"prod"=>$prod);
			$this->sendPostRequest();
		}
	}
	public function checkOutCart(){
		$session = Session::get('session');
		$username = Session::get('username');
		$member = Session::get('member_id');
		$uplink = Session::get('uplink_id');
		if(Session::has('daftar_produk')){
			$prod = Session::get('daftar_produk');
			if (Session::get('session')) {
				$this->params = array("session"=>$session,"id_uplink"=>$uplink,"id_member"=>$member,"username"=>$username,"prod"=>$prod);
				$this->url = 'transaction/transaksi';
				$this->sendPostRequest();
				Session::forget('daftar_produk');
			}
			else{
				$this->params = array("id_uplink"=>$uplink,"id_member"=>$member,"username"=>$username,"prod"=>$prod);
				$this->url = 'nonagen/transaksi';
				$this->sendPostRequest();
				Session::forget('daftar_produk');
			}
			
		}else{
			echo "empty_cart";
		}
	}
	public function removeFromCart(){
		$item = Request::input('item');
		$cart = Session::get('daftar_produk');
		unset($cart[$item]);
		Session::put('daftar_produk',$cart);
	}
	public function getCart(){
		echo json_encode(Session::get('daftar_produk'));
	}
	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
	private function returnPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		return $result;
	}
	private function sendGetRequest(){
		$url = $this->url;
		$sender = new GetSender($url);
		$result = $sender->sendRequest();
		echo $result;
	}

}