<?php
require_once("log_entry_dal.php");
require_once("log_entry.php");

main();

/**
 * Starting point of the log_entry service.
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
	$log_entry = new LogEntry($_POST);
	$errors = LogEntryDAL::save($log_entry);
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
		$success = LogEntryDAL::delete($_POST["id"]);
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
		$log_entry = LogEntryDAL::loadById($_GET["id"]);
		echo json_encode($log_entry);
	} else if (array_key_exists("trip_id", $_GET)) {
		$log_entries = LogEntryDAL::loadAllByTripId($_GET["trip_id"]);
		echo json_encode($log_entries);
	} else {
		$log_entries = LogEntryDAL::loadAll();
		echo json_encode($log_entries);
	}
}

?>