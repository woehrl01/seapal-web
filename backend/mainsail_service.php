<?php
require_once("mainsail.php");

main();

/**
 * Starting point of the mainsail service.
 */
function main() {
	$method = $_GET["method"];

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
	$mainsail = Mainsail::createFromArray($_POST);
	if ($mainsail->save()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$mainsail = Mainsail::createFromArray($_POST);
	if ($mainsail->delete()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGetId() {
	$mainsail = Mainsail::loadById($_POST["id"]);
	echo json_encode($mainsail);
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$mainsails = Mainsail::loadAll();
	echo json_encode($mainsails);
}
?>