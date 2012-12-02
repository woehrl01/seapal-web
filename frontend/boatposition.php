<?php

/*** settings ***/
$filename  = dirname(__FILE__).'/boatposition.txt';

$LEFT_LNG_LIMIT = 9.195;
$RIGHT_LNG_LIMIT = 9.24;
$DEFAULT_CONTENT = "47.655,9.20056,-1";
$TIME_PER_REFRESH = 2;

/*** implementation ***/
$changedExternal = false;
if(file_exists($filename)){

    $firstPositionAge = filemtime($filename);
    $positionAge = $firstPositionAge ;

    while (time() - $positionAge < $TIME_PER_REFRESH) // check if the data file has been modified
    {
      usleep(100000); // sleep 100ms to unload the CPU
      clearstatcache();
      $positionAge = filemtime($filename);
      if($firstPositionAge != $positionAge){
    	$changedExternal = true;
    	break;
      }
    }

    $position = @file_get_contents($filename);
    
}else{
    usleep(1000000 * $TIME_PER_REFRESH);
    $position = $DEFAULT_CONTENT;
}

if(!$changedExternal){

	$positionArray = explode(",", $position);
	$lat = $positionArray[0];
	$long = $positionArray[1];
	$dir = $positionArray[2];

	if ($long > $RIGHT_LNG_LIMIT && $dir > 0) {
		$dir = -1;
	} else if ($long < $LEFT_LNG_LIMIT && $dir < 0) {
		$dir = 1;
	}
	
	$lat -= 0.0000;
	$long += 0.0019 * $dir;
	$position = $lat.",".$long.",".$dir;

	@file_put_contents($filename, $position);
}

$positionArray = explode(",", $position);
$lat = $positionArray[0];
$long = $positionArray[1];

// return a json array
$response = array();
$response['lat']       = $lat;
$response['lng']       = $long;
echo json_encode($response);
flush();

/* filename: boatposition.php */
?>