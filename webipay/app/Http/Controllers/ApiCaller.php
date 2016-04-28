<?php
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ApiCaller
{
    //some variables for the object
    private $_username;
    private $_password;
    private $_api_url;
     
    //construct an ApiCaller object, taking an
    //APP ID, APP KEY and API URL parameter
    public function setValue(){
    	$this->_username = Request::input('username');
    	$this->_password = Request::input('password');
    	$this->_api_url = Request::input('url');
    	if(Request::has('params')){
    		$params = Request::input('params');
    		sendRequest($params);
    	}else{
    		$params = array()
    	}
    }
    
    public function sendRequest($request_params)
    {
        
        $params = array();
         
        //initialize and setup the curl handler
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->_api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, count($params));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
 
        //execute the request
        $result = curl_exec($ch);
         
        //json_decode the result
        $result = @json_decode($result);
         
        //check if we're able to json_decode the result correctly
        if( $result == false || isset($result['success']) == false ) {
            throw new Exception('Request was not correct');
        }
         
        //if there was an error in the request, throw an exception
        if( $result['success'] == false ) {
            throw new Exception($result['errormsg']);
        }
         
        //if everything went great, return the data
        return $result['data'];
    }
}