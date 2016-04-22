<?php namespace App;

use App\IpAddress;
class ApiPostSender extends IpAddress{
	private $url;
	private $params;

	public function __construct($url, $params){
		$this->url = $url;
		$this->params=$params;
	}

	public function sendRequest(){
		$url = $this->address()."/".$this->url;
		$parameter = json_encode($this->params);

		$ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                     
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);            
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