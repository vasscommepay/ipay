<?php namespace App;
	class IpAddress{
		//Setup untuk adress
		public $protocol = 'http'; //protocol http atau https
		public $ipAddress = '11.0.0.48'; //alamat ip API
		public $port = '5000'; //port API
		
		//API address
		function address(){
			$address = $this->protocol.'://'.$this->ipAddress.':'.$this->port;
			return $address;
		}
	}
?>