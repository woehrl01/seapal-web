<?php
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
	$boat = Boat::createFromArray($_POST);
	if ($boat->save()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$boat = Boat::createFromArray($_POST);
	if ($boat->delete()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGetId() {
	$boat = Boat::loadById($_POST["id"]);
	echo json_encode($boat);
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$boats = Boat::loadAll();
	echo json_encode($boats);
}
?>