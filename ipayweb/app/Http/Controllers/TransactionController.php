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
		$produk = Request::input;
	}
	public function quickCheckOut(){
		$session = Session::get('session');
		$id_produk = Request::input('produk');
		$tujuan = Request::input('tujuan');
		$quantity = Request::input('quantity');
		$username = Session::get('username');
		$member = Session::get('member_id');
		$uplink = Session::get('uplink_id');
		$produk = array("id_produk"=>$id_produk,"qty"=>$quantity,"tujuan"=>$tujuan);
		$prod = array();
		array_push($prod,$produk);
		$this->url = 'transaction/transaksi';
		$this->params = array("session"=>$session,"id_uplink"=>$uplink,"id_member"=>$member,"username"=>$username,"prod"=>$prod);
		$this->sendPostRequest();
	}
	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
	private function sendGetRequest(){
		$url = $this->url;;
		$sender = new GetSender($url);
		$result = $sender->sendRequest();
		echo $result;
	}

}