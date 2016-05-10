<?php namespace App;
	class IpAddress{
		//Setup untuk adress
		public $protocol = 'http'; //protocol http atau https
		public $ipAddress = '192.168.173.13'; //alamat ip API
		public $port = '81'; //port API
		
		//API address
		function address(){
			$address = $this->protocol.'://'.$this->ipAddress.':'.$this->port;
			return $address;
		}
	}
?>