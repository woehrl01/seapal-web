<?php
require_once("simple_entry.php");
require_once("database.php");

final class MarkDAL {

	private function __construct() {}

	/**
	 * Loads a mark with a specific ID from the database.
	 * @return An instance of an mark or NULL.
	 */
	public static function loadById($markId){
		$mark = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, name FROM mark WHERE id='%s",
            mysql_real_escape_string($markId));

		$db->querySelect($sql);

		$row = $db->getNextRow();
		
		if ($row) {
			$mark = new SimpleEntry($row);
		}
		
		$db->close();
		return $mark;
	}

	/**
	 * Loads all marks from the database.
	 * @return An array of marks.
	 */
	public static function loadAll() {
		$marks = array();

		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, name FROM mark");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$mark = new SimpleEntry($row);
			if ($mark->isValid()) {
				array_push($marks, $mark);
			}
		}

		$db->close();
		return $marks;
	}
}

?>