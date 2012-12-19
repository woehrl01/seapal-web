<?php
require_once("simple_entry.php");
require_once("database.php");

final class MainsailDAL {

	private function __construct() {}

	/**
	 * Loads a mainsail with a specific ID from the database.
	 * @return An instance of an mainsail or NULL.
	 */
	public static function loadById($mainsailId){
		$mainsail = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, name FROM mainsail WHERE id='%s",
            mysql_real_escape_string($mainsailId);

		$db->querySelect($sql);

		$row = $db->getNextRow();
		
		if ($row) {
			$mainsail = new SimpleEntry($row);
		}
		
		$db->close();
		return $mainsail;
	}

	/**
	 * Loads all mainsails from the database.
	 * @return An array of mainsails.
	 */
	public static function loadAll() {
		$mainsails = array();

		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, name FROM mainsail");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$mainsail = new SimpleEntry($row);
			if ($mainsail->isValid()) {
				array_push($mainsails, $mainsail);
			}
		}

		$db->close();
		return $mainsails;
	}
}

?>