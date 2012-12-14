<?php
require_once("trip.php");
require_once("database.php");

final class TripDAL {

	private function __construct() {}

	/**
	 * Loads a trip with a specific ID from the database.
	 * @return An instance of an trip or NULL.
	 */
	public static function loadById($tripId){
		$trip = NULL;
		$db = DBConnector::getConnection();

		$sql = sprintf("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew
            FROM trip
            WHERE id='%s'",
            $tripId);

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
			if ($trip->isValid()) {
				array_push($trips, $trip);
			}
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
            $boatId);

		$db = DBConnector::getConnection();
		$db->querySelect($sql);

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$trip = new Trip($row);
			if ($trip->isValid()) {
				array_push($trips, $trip);
			}
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

    	return FALSE;
    }

    /**
     * Inserts a new trip to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($trip) {
		$db = DBConnector::getConnection();

		$sql = sprintf("INSERT INTO trip (id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew)
            VALUES ('', '%s', '%s', '%s', '%s', '%s', '%s', '%s',
            '%s', '%s')",
			$this->getBoatId(),
			$this->getTripTitle(),
			$this->getTripFrom(),
			$this->geTripTo(),
			$this->getStartTime(),
			$this->getEndTime(),
			$this->getEngine_runtime(),
			$this->getTankFilled(),
			$this->getCrew());

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
            $this->getBoatId(),
			$this->getTripTitle(),
			$this->getTripFrom(),
			$this->geTripTo(),
			$this->getStartTime(),
			$this->getEndTime(),
			$this->getEngine_runtime(),
			$this->getTankFilled(),
			$this->getCrew(),
            $trip->getId());

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
			$tripId);

		$status = $db->queryExecute($sql);
		$db->close();

		return $status;
	}
}

?>