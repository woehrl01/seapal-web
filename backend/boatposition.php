<?php

$filename  = dirname(__FILE__).'/boatposition.txt';

$firstPositionAge = filemtime($filename);
$positionAge = $firstPositionAge ;

$timePerRefresh = 1;

$changedExternal = false;

while (time() - $positionAge < $timePerRefresh) // check if the data file has been modified
{
  usleep(10000); // sleep 200ms to unload the CPU
  clearstatcache();
  $positionAge = filemtime($filename);
  if($firstPositionAge != $positionAge){
	$changedExternal = true;
	break;
  }
}

$position = file_get_contents($filename);
if(!$changedExternal){

	$positionArray = explode(",", $position);
	$lat = $positionArray[0];
	$long = $positionArray[1];

	$lat -= 0.00000;
	$long += 0.00000;
	$position = $lat.",".$long;

	file_put_contents($filename, $position);
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