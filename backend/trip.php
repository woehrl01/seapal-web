<?php
require_once("database.php");

final class Trip implements JsonSerializable {
	private $id;
	private $boat_id;
	private $trip_title;
    private $trip_from;
    private $trip_to;
    private $crew;
    private $start_time;
    private $end_time;
    private $engine_runtime;
    private $tank_filled;

    // indicates whether the instance is valid or not.
    private $valid;

    private function __construct() {
    	$this->valid = FALSE;
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($tripArray) {

    	if (array_key_exists("id", $tripArray)) {
    		$this->id = mysql_real_escape_string($tripArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->boat_id    		  = mysql_real_escape_string(1);
	    $this->trip_title         = mysql_real_escape_string($tripArray["trip_title"]);
    	$this->trip_from          = mysql_real_escape_string($tripArray["trip_from"]);
    	$this->trip_to            = mysql_real_escape_string($tripArray["trip_to"]);
    	$this->crew               = mysql_real_escape_string($tripArray["crew"]);
    	$this->start_time         = mysql_real_escape_string($tripArray["start_time"]);
    	$this->end_time           = mysql_real_escape_string($tripArray["end_time"]);
    	$this->engine_runtime     = mysql_real_escape_string($tripArray["engine_runtime"]);
    	$this->tank_filled        = mysql_real_escape_string($tripArray["tank_filled"]);

	    $this->valid = TRUE;
    }

    /**
	 * Creats a trip from an associative array.
	 * @return An instance of an trip.
	 */
    public static function createFromArray($tripArray) {
    	$trip = new self();
    	$trip->parse($tripArray);
    	return $trip;
    }

	/**
	 * Loads a tripwith a specific ID from the database.
	 * @return An instance of an trip.
	 */
	public static function loadById($tripId){
		$trip = new self();
		$db = DBConnector::getConnection();
		$db->query("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew
                FROM trip
                WHERE id='$tripId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$trip->parse($row);
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
		$db->query("SELECT id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew
                FROM trip");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$trip = new self();
			$trip->parse($row);
			array_push($trips, $trip);
		}

		$db->close();
		return $trips;
	}

	/**
	 * Saves or updates the trip to the database.
	 * @return TRUE, if the save operation was successfull.
	 */
    public function save() {
    	if ($this->valid) {
    		if ($this->id == -1) {
    			return $this->saveNew();
    		} else {
    			return $this->updateExisting();
    		}
    	}
    }

    /**
     * Saves a new trip to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private function saveNew() {
		$db = DBConnector::getConnection();
		$status = $db->query("INSERT INTO trip (id, boat_id, trip_title, trip_from, trip_to, start_time, end_time, engine_runtime, skipper, tank_filled, crew)
            VALUES ('', '$this->boat_id', '$this->trip_title', '$this->trip_from', '$this->trip_to', '$this->start_time', '$this->end_time', '$this->engine_runtime', '$this->tank_filled', '$this->crew')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing trip in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private function updateExisting() {
		$db = DBConnector::getConnection();
		$status = $db->query("UPDATE trip SET boat_id='$this->boat_id', trip_title='$this->trip_title', trip_from='this->trip_from', trip_to='$this->trip_to', start_time='$this->start_time', end_time='$this->end_time', engine_runtime='$this->engine_runtime', skipper='', tank_filled='$this->tank_filled', crew='$this->crew'
                WHERE id='$this->id'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a trip from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public function delete() {
		$db = DBConnector::getConnection();
		$status = $db->query("DELETE FROM trip WHERE id='$this->id'");
		$db->close();

		return $status;
	}

	/**
	 * Indicates whether the trip is valid or not.
	 * @return Returns TRUE if the trip is valid.
	 */
	public function isValid () {
		return $this->valid;
	}

	// function called when encoded with json_encode
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

?>