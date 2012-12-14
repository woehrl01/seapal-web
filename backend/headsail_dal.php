<?php
require_once("simple_entry.php");
require_once("database.php");

final class HeadsailDAL {

	private function __construct() {}

	/**
	 * Loads a headsail with a specific ID from the database.
	 * @return An instance of an headsail or NULL.
	 */
	public static function loadById($headsailId){
		$headsail = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, name FROM headsail WHERE id='%s",
            $headsailId);

		$db->querySelect($sql);

		$row = $db->getNextRow();
		
		if ($row) {
			$headsail = new SimpleEntry($row);
		}
		
		$db->close();
		return $headsail;
	}

	/**
	 * Loads all headsails from the database.
	 * @return An array of headsails.
	 */
	public static function loadAll() {
		$headsails = array();

		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, name FROM headsail");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$headsail = new SimpleEntry($row);
			if ($headsail->isValid()) {
				array_push($headsails, $headsail);
			}
		}

		$db->close();
		return $headsails;
	}
}

?>