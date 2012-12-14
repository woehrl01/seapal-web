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
			manuever_id, headsail_id, mainsail_id
            FROM waypoint
            WHERE id='%s",
                $logEntryId);

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
			manuever_id, headsail_id, mainsail_id
            FROM waypoint");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$logEntry = new LogEntry($row);
			if ($logEntry->isValid()) {
				array_push($logEntrys, $logEntry);
			}
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
			manuever_id, headsail_id, mainsail_id
            FROM waypoint
            WHERE trip_id='%s'",
            $tripId);

		$db->querySelect($sql);

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$logEntry = new LogEntry($row);
			if ($logEntry->isValid()) {
				array_push($logEntrys, $logEntry);
			}
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

    	return FALSE;
    }

    /**
     * Inserts a new logEntry to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($logEntry) {
		$db = DBConnector::getConnection();

		$sql = sprintf("INSERT INTO waypoint (id, north_degree, north_minutes, north_seconds, east_degree,
			east_minutes, east_seconds, trip_id, cog, sog, datetime, btm, dtm, trip_to,
			manuever_id, headsail_id, mainsail_id)
            VALUES ('', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
				$logEntry->getNorthDegree(),
				$logEntry->getNorthMinutes(),
				$logEntry->getNorthMinutes(),
				$logEntry->getEastDegree(),
				$logEntry->getEastMinutes(),
				$logEntry->getEastSeconds(),
                $logEntry->getTripId(),
                $logEntry->getCog(),
                $logEntry->getSog(),
                $logEntry->getDatetime(),
                $logEntry->getBtm(),
                $logEntry->getDtm(),
                $logEntry->getTripTo(),
                $logEntry->getManeuverId(),
                $logEntry->getHeadsailId(),
                $logEntry->getMainsailId());

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
                $logEntry->getNorthDegree(),
				$logEntry->getNorthMinutes(),
				$logEntry->getNorthMinutes(),
				$logEntry->getEastDegree(),
				$logEntry->getEastMinutes(),
				$logEntry->getEastSeconds(),
                $logEntry->getTripId(),
                $logEntry->getCog(),
                $logEntry->getSog(),
                $logEntry->getDatetime(),
                $logEntry->getBtm(),
                $logEntry->getDtm(),
                $logEntry->getTripTo(),
                $logEntry->getManeuverId(),
                $logEntry->getHeadsailId(),
                $logEntry->getMainsailId(),
                $logEntry->getId());

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
			$logEntryId);

		$status = $db->queryExecute($sql);
		$db->close();

		return $status;
	}
}

?>