<?php
require_once("boat_dal.php");
require_once("boat.php");

main();

/**
 * Starting point of the boat service.
 */
function main() {
	$method = $_POST["method"];

	switch($method) {
		case "save":
			handleSave();
			break;

		case "delete":
			handleDelete();
			break;

		case "get_id":
			handleGetId();
			break;

		case "get_all":
			handleGetAll();
			break;
	}
}

/**
 * Handles the save/update operation.
 */
function handleSave() {
	$boat = new Boat($_POST);
	if (BoatDAL::save($boat)) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
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
function handleGetId() {
	if (array_key_exists("id", $_POST)) {
		$boat = BoatDAL::loadById($_POST["id"]);
		echo json_encode($boat);
	}
	// TODO: what to write out if there was an error?
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$boats = BoatDAL::loadAll();
	echo json_encode($boats);
	// TODO: what to write out if there was an error?
}

?>