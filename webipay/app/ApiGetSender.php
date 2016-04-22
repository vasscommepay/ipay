<?php namespace App;

use App\IpAddress;
	class ApiGetSender extends IpAddress{
		private $url;

		public function __construct($url){
			$this->url = $url;
		}

		public function sendRequest(){
			$url = $this->address()."/".$this->url;

			$ch = curl_init($url);
	        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");               
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	                'Content-Type: application/json')                   
	        );   
	        $result = curl_exec($ch);
	        curl_close($ch);
	        return $result;
		}

	}
?>