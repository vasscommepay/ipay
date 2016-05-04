<?php namespace App;
	class IpAddress{
		//Setup untuk adress
		public $protocol = 'http'; //protocol http atau https
		public $ipAddress = '127.0.0.1'; //alamat ip API
		public $port = '81'; //port API
		
		//API address
		function address(){
			$address = $this->protocol.'://'.$this->ipAddress.':'.$this->port;
			return $address;
		}
	}
?>