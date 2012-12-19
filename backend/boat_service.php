<?php
require_once("boat_dal.php");
require_once("boat.php");

main();

/**
 * Starting point of the boat service.
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
	$boat = new Boat($_POST);
	$errors = BoatDAL::save($boat) ;
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
		$success = BoatDAL::delete($_POST["id"]);
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
		$boat = BoatDAL::loadById($_GET["id"]);
		echo json_encode($boat);
	}else{
		$boats = BoatDAL::loadAll();
		echo json_encode($boats);
	}
}

?>