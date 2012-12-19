<?php
require_once("database.php");
require_once("validator.php");

final class Trip implements JsonSerializable {
	private $valid;

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

	/**
	 * Creats a trip from an associative array.
	 * @param A associative array with trip data, like the POST-Array.
	 * @return An instance of an trip.
	 */
    public function __construct($tripArray) {
    	$this->parse($tripArray);
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

    	$this->boat_id    		  = mysql_real_escape_string($tripArray["boat_id"]);
	    $this->trip_title         = mysql_real_escape_string($tripArray["trip_title"]);
    	$this->trip_from          = mysql_real_escape_string($tripArray["trip_from"]);
    	$this->trip_to            = mysql_real_escape_string($tripArray["trip_to"]);
    	$this->crew               = mysql_real_escape_string($tripArray["crew"]);
    	$this->start_time         = mysql_real_escape_string($tripArray["start_time"]);
    	$this->end_time           = mysql_real_escape_string($tripArray["end_time"]);
        $this->timespan           = $this->start_time - $this->end_time;
    	$this->engine_runtime     = mysql_real_escape_string($tripArray["engine_runtime"]);
    	$this->tank_filled        = mysql_real_escape_string($tripArray["tank_filled"]);
    }

    /**
     * Validates field values.
     * @return TRUE, if everything is valid.
     */
    private function validate() {
        if (!Valid::is_number($this->id, Valid::$REQ)) return FALSE;
        if (!Valid::is_required($this->trip_title)) return FALSE;
        if (!Valid::is_number_min($this->engine_runtime, 0, Valid::$NOT_REQ)) return FALSE;
        //TODO: start_time
        //TODO: end_time
        //TODO: tank_filled

        return TRUE;
    }

    /**
     * Serializes the object. Needed because of private members.
     * @return thr serialized object.
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /**
     * Checks whether the trip is new or not.
     * @return Returns TRUE, if the boat is (ID == -1).
     */
    public function isNew() {
        return $this->id == -1;
    }

	/**
	 * Indicates whether the trip is valid or not.
	 * @return Returns TRUE if the trip is valid.
	 */
	public function isValid () {
		return $this->validate();
	}

	/* Properties */

    public function getId() {
        return $this->id;
    }

    public function getBoatId() {
		return $this->boatId;
    }

	public function getTripTitle() {
		return $this->trip_title;
	}

    public function getTripFrom() {
		return $this->trip_from;
    }

    public function getTripTo() {
		return $this->trip_to;
    }

    public function getCrew() {
		return $this->crew;
    }

    public function getStartTime() {
		return $this->start_time;
    }
    
    public function getEndTime() {
		return $this->end_time;
    }

    public function getTimespan() {
        return $this->timespam;
    }
    
    public function getEngineRuntime() {
		return $this->engine_runtime;
    }
    
    public function getTankFilled() {
		return $this->tank_filled;
    }
}

?>