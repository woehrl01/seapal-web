<?php
require_once("headsail.php");

main();

/**
 * Starting point of the headsail service.
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
	$headsail = Headsail::createFromArray($_POST);
	if ($headsail->save()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$headsail = Headsail::createFromArray($_POST);
	if ($headsail->delete()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGetId() {
	$headsail = Headsail::loadById($_POST["id"]);
	echo json_encode($headsail);
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$headsails = Headsail::loadAll();
	echo json_encode($headsails);
}
?>