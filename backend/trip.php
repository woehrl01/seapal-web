<?php
require_once("validator.php");

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
    private $skipper;
    private $tank_filled;
    private $note;

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
    		$this->id = $tripArray["id"];
    	} else {
    		$this->id = -1;
    	}

    	$this->boat_id    		  = $tripArray["boat_id"];
	    $this->trip_title         = $tripArray["trip_title"];
    	$this->trip_from          = $tripArray["trip_from"];
    	$this->trip_to            = $tripArray["trip_to"];
    	$this->crew               = $tripArray["crew"];
    	$this->start_time         = $tripArray["start_time"];
    	$this->end_time           = $tripArray["end_time"];
    	$this->engine_runtime     = $tripArray["engine_runtime"];
        $this->skipper            = $tripArray["skipper"];

        if (array_key_exists("tank_filled", $tripArray)) {
            $this->tank_filled = 1; // true for MySQL 
        } else {
            $this->tank_filled = 0; // false for MySQL
        }

        $this->note               = $tripArray["note"];
    }

    /**
     * Validates field values.
     * @return An array of invalid fields.
     */
    private function validate() {
        $errors = array();

        if (!Valid::is_number($this->id, Valid::$REQ)) array_push($errors, "id");
        if (!Valid::is_required($this->trip_title)) array_push($errors, "trip_title");
        if (!Valid::is_number_min($this->engine_runtime, 0, Valid::$NOT_REQ))array_push($errors, "engine_runtime");
        //TODO: start_time
        //TODO: end_time
        //TODO: tank_filled

        return $errors;
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
        $errors = $this->validate();
        return !(is_array($errors) && !empty($errors));
    }

    /**
     * Gets the invalid fields.
     * @return Returns every field which contains invalid data.
     */
    public function getErrors(){
        return $this->validate();
    }

	/* Properties */

    public function getId() {
        return $this->id;
    }

    public function getBoatId() {
		return $this->boat_id;
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
    
    public function getEngineRuntime() {
		return $this->engine_runtime;
    }

    public function getSkipper() {
        return $this->skipper;
    }
    
    public function getTankFilled() {
		return $this->tank_filled;
    }

    public function getNote() {
        return $this->note;
    }
}

?>