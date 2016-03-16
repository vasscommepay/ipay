<?php 
namespace App\Http\Controllers;
//use Illuminate\Http\Request;
//use App\Http\Requests;
use Illuminate\Routing\Controller as BaseController;
use App\ApiPostSender as PostSender;
use App\ApiGetSender as GetSender;
use Request;

class memberController extends Controller {
    private $url;
	private $params;

	public function addMember(){
		$this->url = 'addMember';
		$mnama = Request::input('nama');
		$mktp = Request::input('noktp');
		$mnpwp = Request::input('npwp');
		$form1 = array('nama'=>$mnama,'noktp'=>$mktp,'npwp'=>$mnpwp);
		Session::put('form1',$form1);
	}
	public function addMemberAddress(){
		$this->url = 'addMemberAddress';
		$jalan = Request::input('jalan');
		$kecamatan = Request::input('kecamatan');
		$kota = Request::input('kota');
		$provinsi = Request::input('provinsi');
		$keterangan = Request::input('keterangan');
		$form2 = array('jalan'=>$jalan,'kecamatan'=>$kecamatan,'kota'=>$kota,'provinsi'=>$kota,'keterangan'=>$keterangan);
		Session::put('form2',$form2);
	}
	public function addMemberContact(){
		$this->url = 'addMemberContact';
		$channel = Request::input('channel');
		$form3 = array('channel'=>$channel);
		Session::put('form3',$form3);
	}
	<?php
		print_r(array_merge($form1, $form2, $form3))
	?>
}
