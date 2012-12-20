<?php
require_once("log_entry.php");
require_once("database.php");

final class LogEntryDAL {

	private function __construct() {}

	/**
	 * Loads a logEntrywith a specific ID from the database.
	 * @return An instance of an logEntry or NULL.
	 */
	public static function loadById($logEntryId){
		$logEntry = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, north_degree, north_minutes, north_seconds, east_degree,
			east_minutes, east_seconds, trip_id, cog, sog, datetime, btm, dtm, trip_to,
			maneuver_id, headsail_id, mainsail_id
            FROM waypoint
            WHERE id='%s",
            mysql_real_escape_string($logEntryId));

		$db->querySelect($sql);

		$row = $db->getNextRow();
		
		if ($row) {
			$logEntry = new LogEntry($row);
		}
		
		$db->close();
		return $logEntry;
	}

	/**
	 * Loads all logEntrys from the database.
	 * @return An array of logEntrys.
	 */
	public static function loadAll() {
		$logEntrys = array();

		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, north_degree, north_minutes, north_seconds, east_degree,
			east_minutes, east_seconds, trip_id, cog, sog, datetime, btm, dtm, trip_to,
			maneuver_id, headsail_id, mainsail_id
            FROM waypoint");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$logEntry = new LogEntry($row);
			array_push($logEntrys, $logEntry);
		}

		$db->close();
		return $logEntrys;
	}

	/**
	 * Loads all logEntries of the given trip ID from the database.
	 * @return An array of logEntrys.
	 */
	public static function loadAllByTripId($tripId) {
		$logEntrys = array();

		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, north_degree, north_minutes, north_seconds, east_degree,
			east_minutes, east_seconds, trip_id, cog, sog, datetime, btm, dtm, trip_to,
			maneuver_id, headsail_id, mainsail_id
            FROM waypoint
            WHERE trip_id='%s'",
            mysql_real_escape_string($tripId));

		$db->querySelect($sql);

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$logEntry = new LogEntry($row);
			array_push($logEntrys, $logEntry);
		}

		$db->close();
		return $logEntrys;
	}

	/**
	 * Saves or updates the logEntry to the database.
	 * @return TRUE, if the save operation was successfull.
	 */
    public static function save($logEntry) {
    	if ($logEntry->isValid()) {
    		if ($logEntry->isNew()) {
    			return LogEntryDAL::insert($logEntry);
    		}	
    		return LogEntryDAL::update($logEntry);
    	}

    	return $logEntry->getErrors();
    }

    /**
     * Inserts a new logEntry to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($logEntry) {
		$db = DBConnector::getConnection();

		$sql = sprintf("INSERT INTO waypoint (north_degree, north_minutes, north_seconds, east_degree,
			east_minutes, east_seconds, trip_id, cog, sog, datetime, btm, dtm, trip_to,
			maneuver_id, headsail_id, mainsail_id)
            VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
				mysql_real_escape_string($logEntry->getNorthDegree()),
				mysql_real_escape_string($logEntry->getNorthMinutes()),
				mysql_real_escape_string($logEntry->getNorthMinutes()),
				mysql_real_escape_string($logEntry->getEastDegree()),
				mysql_real_escape_string($logEntry->getEastMinutes()),
				mysql_real_escape_string($logEntry->getEastSeconds()),
                mysql_real_escape_string($logEntry->getTripId()),
                mysql_real_escape_string($logEntry->getCog()),
                mysql_real_escape_string($logEntry->getSog()),
                mysql_real_escape_string($logEntry->getDatetime()),
                mysql_real_escape_string($logEntry->getBtm()),
                mysql_real_escape_string($logEntry->getDtm()),
                mysql_real_escape_string($logEntry->getTripTo()),
                mysql_real_escape_string($logEntry->getManeuverId()),
                mysql_real_escape_string($logEntry->getHeadsailId()),
                mysql_real_escape_string($logEntry->getMainsailId()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing logEntry in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private static function update($logEntry) {
		$db = DBConnector::getConnection();

		$sql = sprintf("UPDATE waypoint SET north_degree='%s', north_minutes='%s', north_seconds='%s', east_degree='%s', 
                east_minutes='%s', east_seconds='%s', trip_id='%s', cog='%s', sog='%s', datetime='%s', 
                btm='%s', dtm='%s', trip_to='%s', maneuver_id='%s', headsail_id='%s', mainsail_id='%s'
                WHERE id='%s",
                mysql_real_escape_string($logEntry->getNorthDegree()),
				mysql_real_escape_string($logEntry->getNorthMinutes()),
				mysql_real_escape_string($logEntry->getNorthMinutes()),
				mysql_real_escape_string($logEntry->getEastDegree()),
				mysql_real_escape_string($logEntry->getEastMinutes()),
				mysql_real_escape_string($logEntry->getEastSeconds()),
                mysql_real_escape_string($logEntry->getTripId()),
                mysql_real_escape_string($logEntry->getCog()),
                mysql_real_escape_string($logEntry->getSog()),
                mysql_real_escape_string($logEntry->getDatetime()),
                mysql_real_escape_string($logEntry->getBtm()),
                mysql_real_escape_string($logEntry->getDtm()),
                mysql_real_escape_string($logEntry->getTripTo()),
                mysql_real_escape_string($logEntry->getManeuverId()),
                mysql_real_escape_string($logEntry->getHeadsailId()),
                mysql_real_escape_string($logEntry->getMainsailId()),
                mysql_real_escape_string($logEntry->getId()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Deletes a logEntry from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public static function delete($logEntryId) {
		$db = DBConnector::getConnection();

		$sql = sprintf("DELETE FROM waypoint WHERE id='%s'",
			mysql_real_escape_string($logEntryId));

		$status = $db->queryExecute($sql);
		$db->close();

		return $status;
	}
}

?>