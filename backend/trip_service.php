<?php
require_once("trip_dal.php");
require_once("trip.php");

main();

/**
 * Starting point of the trip service.
 */
function main() {
	$method = strtoupper($_SERVER['REQUEST_METHOD']);

	if($method == "POST"){
		$method = strtoupper($_POST["method"]);	
	}

	switch($method) {
		case "SAVE":
			handleSave();
			break;

		case "DELETE":
			handleDelete();
			break;

		case "GET":
			handleGet();
			break;
	}
}

/**
 * Handles the save/update operation.
 */
function handleSave() {
	$trip = new Trip($_POST);
	$errors = TripDAL::save($trip);
	if (!is_array($errors)) {
		echo '{"success":true}';
	} else {
		echo '{"success":false, "errors": '.json_encode($errors).'}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$success = FALSE;

	if (array_key_exists("id", $_POST)) {
		$success = TripDAL::delete($_POST["id"]);
	} 

	if ($success) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGet() {
	if (array_key_exists("id", $_GET)) {
		$trip = TripDAL::loadById($_GET["id"]);
		echo json_encode($trip);
	} else if(array_key_exists("boat_id", $_GET)) {
		$trips = TripDAL::loadAllByBoatId($_GET["boat_id"]);
		echo json_encode($trips);
	} else {
		$trips = TripDAL::loadAll();
		echo json_encode($trips);
	}
}

?>