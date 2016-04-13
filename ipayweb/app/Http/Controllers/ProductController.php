<?PHP namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;

class ProductController extends BaseController {
	private $url;
	private $params;
	public function addMasterProduct(){
		$this->url = 'dashbooardFranchiseeAdd';
		$fid = Request::input('fid');
		$nama = Request::input('nama');
		$alamat = Request::input('alamat');
		$amount = Request::input('amount');
		$keterangan = Request::input('keterangan');
		$this->params = array('fid'=>$fid,'nama'=>$nama,'alamat'=>$alamat);
		$result = $this->createFr();
		//echo $result;
		// $res = json_decode($result,true);
		if($result=='{"isSuccess":true}'){
			//echo "Hay";
			$this->url = 'dashbooardFranchiseeDepositTambah';
			$this->params = array('fid' =>$fid ,'amount'=>$amount,'keterangan'=>$keterangan);
			//echo json_encode($this->params);
			$this->sendPostRequest();
		}
	}
	public function produk(){
		$this->url = 'produk/getProduk';
		$id_kategori = Request::('id_kategori');
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

	public function editFranchise(){
		$this->url = 'dashbooardFranchiseeEdit';
		$fid = Request::input('newfid');
		$nama = Request::input('newnama');
		$alamat = Request::input('newalamat');
		$this->params = array('fid'=>$fid,'nama'=>$nama,'alamat'=>$alamat);
		// $par = json_encode($this->params);
		// echo $par;
		$this->sendPostRequest();
	}
	public function showFranchise(){
		$this->url = 'dashbooardFranchiseeAll';
		$this->sendGetRequest();
	}

	private function createFr(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		return $result;
	}
	private function sendPostRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new PostSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}
	private function readEcho($func) {
	    ob_start();
	    $func;
	    return ob_get_clean();
	}
	private function sendGetRequest(){
		$url = $this->url;
		$params = $this->params;
		$sender = new GetSender($url,$params);
		$result = $sender->sendRequest();
		echo $result;
	}

}