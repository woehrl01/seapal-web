<?php
require_once("trip.php");
require_once("database.php");

final class TripDAL {

	private function __construct() {}

	/**
	 * Loads a trip with a specific ID from the database.
	 * @return An instance of an trip or NULL.
	 */
	public static function loadById($tripId) {
		$trip = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew
            FROM trip
            WHERE id='%s'",
            mysql_real_escape_string($tripId));

		$db->querySelect($sql);

		$row = $db->getNextRow();
		
		if ($row) {
			$trip = new Trip($row);
		}
		
		$db->close();
		return $trip;
	}


	/**
	 * Loads all trips from the database.
	 * @return An array of trips.
	 */
	public static function loadAll() {
		$trips = array();

		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time,
			engine_runtime, skipper, tank_filled, crew
            FROM trip");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$trip = new Trip($row);
			array_push($trips, $trip);
		}

		$db->close();
		return $trips;
	}

	/**
	 * Loads all trips with the fiven boat ID from the database.
	 * @return An array of trips.
	 */
	public static function loadAllByBoatId($boatId) {
		$trips = array();

		$sql = sprintf("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time,
			engine_runtime, skipper, tank_filled, crew
            FROM trip
            WHERE boat_id='%s'",
            mysql_real_escape_string($boatId));

		$db = DBConnector::getConnection();
		$db->querySelect($sql);

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$trip = new Trip($row);
			array_push($trips, $trip);
		}

		$db->close();
		return $trips;
	}

	/**
	 * Saves or updates the trip to the database.
	 * @return TRUE, if the save operation was successfull.
	 */
    public static function save($trip) {
    	if ($trip->isValid()) {
    		if ($trip->isNew()) {
    			return TripDAL::insert($trip);
    		}
    		return TripDAL::update($trip);
    	}

    	return $trip->getErrors();
    }

    /**
     * Inserts a new trip to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($trip) {
		$db = DBConnector::getConnection();

		$sql = sprintf("INSERT INTO trip (boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew)
            VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s',
            '%s', '%s', '%s')",
			mysql_real_escape_string($trip->getBoatId()),
			mysql_real_escape_string($trip->getTripTitle()),
			mysql_real_escape_string($trip->getTripFrom()),
			mysql_real_escape_string($trip->getTripTo()),
			mysql_real_escape_string($trip->getStartTime()),
			mysql_real_escape_string($trip->getEndTime()),
			mysql_real_escape_string($trip->getEngineRuntime()),
			mysql_real_escape_string($trip->getSkipper()),
			mysql_real_escape_string($trip->getTankFilled()),
			mysql_real_escape_string($trip->getCrew()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing trip in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private static function update($trip) {
		$db = DBConnector::getConnection();

		$sql = sprintf("UPDATE trip SET boat_id='%s', trip_title='%s', trip_from='%s', trip_to='%s', start_time='%s', end_time='%s', engine_runtime='%s', skipper='%s', tank_filled='%s', crew='%s'
            WHERE id='%s'",
            mysql_real_escape_string($trip->getBoatId()),
			mysql_real_escape_string($trip->getTripTitle()),
			mysql_real_escape_string($trip->getTripFrom()),
			mysql_real_escape_string($trip->getTripTo()),
			mysql_real_escape_string($trip->getStartTime()),
			mysql_real_escape_string($trip->getEndTime()),
			mysql_real_escape_string($trip->getEngineRuntime()),
			mysql_real_escape_string($trip->getTankFilled()),
			mysql_real_escape_string($trip->getSkipper()),
			mysql_real_escape_string($trip->getCrew()),
            mysql_real_escape_string($trip->getId()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Deletes a trip from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public static function delete($tripId) {
		$db = DBConnector::getConnection();

		$sql = sprintf("DELETE FROM trip WHERE id='%s'",
			mysql_real_escape_string($tripId));

		$status = $db->queryExecute($sql);
		$db->close();

		return $status;
	}
}

?>