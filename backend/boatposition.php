<?php

$filename  = dirname(__FILE__).'/boatposition.txt';

$firstPositionAge = filemtime($filename);
$positionAge = $firstPositionAge ;

$timePerRefresh = 2000;

$changedExternal = false;

while (time() - $positionAge < $timePerRefresh) // check if the data file has been modified
{
  usleep(200000); // sleep 200ms to unload the CPU
  clearstatcache();
  $positionAge = filemtime($filename);
  
  if($firstPositionAge != $positionAge){
	$changedExternal = true;
	break;
  }
}

if(!$changedExternal){
	$position = file_get_contents($filename);
	$positionArray = explode(",", $position);
	$lat = $positionArray[0];
	$long = $positionArray[1];

	$lat += 0.00000001;
	$long += 0.00000001;
	$position = $lat.",".$long;

	file_put_contents($filename, $position);
}else{
	$position = file_get_contents($filename);
}

// return a json array
$response = array();
$response['position']       = $position;
echo json_encode($response);
flush();

/* filename: boatposition.php */
?>