<?PHP namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;

class FranchiseController extends BaseController {
	private $url;
	private $params;

	public function addFranchise(){
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