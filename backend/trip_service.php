<?php
require_once("trip.php");

main();

/**
 * Starting point of the trip service.
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
	$trip = Trip::createFromArray($_POST);
	if ($trip->save()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$trip = Trip::createFromArray($_POST);
	if ($trip->delete()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGetId() {
	$trip = Trip::loadById($_POST["id"]);
	echo json_encode($trip);
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$trips = Trip::loadAll();
	echo json_encode($trips);
}
?>