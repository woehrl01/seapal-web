<?php
require_once("maneuver.php");

main();

/**
 * Starting point of the maneuver service.
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
	$maneuver = Maneuver::createFromArray($_POST);
	if ($maneuver->save()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the delete operation.
 */
function handleDelete() {
	$maneuver = Maneuver::createFromArray($_POST);
	if ($maneuver->delete()) {
		echo '{"success":true}';
	} else {
		echo '{"success":false}';
	}
}

/**
 * Handles the get by id operation.
 */
function handleGetId() {
	$maneuver = Maneuver::loadById($_POST["id"]);
	echo json_encode($maneuver);
}

/**
 * Handles the get all operation.
 */
function handleGetAll() {
	$maneuvers = Maneuver::loadAll();
	echo json_encode($maneuvers);
}
?>