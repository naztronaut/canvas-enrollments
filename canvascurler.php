<?php
	/*
		canvascurler.php
		Title: Canvas Enrollments API - List Users' Enrollments
		Author: Nazmus
		URL: https://www.easyprogramming.net
		Instructure Docs: https://canvas.instructure.com/doc/api/enrollments.html
		Github: https://github.com/naztronaut/

		Custom JS file for Enrollments Script
	*/

    date_default_timezone_set('America/New_York');

    //if URL parameter is sent
    if(isset($_GET['url'])){

        //get token and cert
        $domain = $_GET['domain'];
        $apiKey = $_GET['apiKey'];

        //get the URL to input below along with environment
        $url = $_GET['url'];

        //initialize curl
        $ch = curl_init();
        
        //set URL option for GET requests only - insert environment, url, and access_token based on above switch statement
        curl_setopt($ch, CURLOPT_URL, 'https://'.$domain.'.'.$url.'&access_token='.$apiKey); //&search_term=' . $search);
        curl_setopt($ch,CURLOPT_FAILONERROR,true);

        //set to 0 and 0 if page blank or error on certificate - CURL does not natively work on SSL unless you provide a cert
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

        //varbose logging
        curl_setopt($ch, CURLOPT_VERBOSE,true);

        //set option of CURLOPT_CAINFO and location of cert in $cert
//        curl_setopt($ch, CURLOPT_CAINFO, $cert);

        //forcing GET request
        //  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        //  curl_setopt($ch, CURLOPT_HTTPGET, true);

        //store and output curl_exec tresults into $content
        $content = trim(curl_exec($ch));

        //uncomment next two lines to display errors on the page - error 77 or 60 have to do with the cert - make sure you use the correct cert with the correct environment
          curl_error($ch);
        if(!$content){
          echo curl_errno($ch) . ' errno';
        }

        // close curl connection
         curl_close($ch);
    }
?>

