<?php
require_once("validator.php");

final class LogEntry implements JsonSerializable {
	private $valid;

    private $id;
    private $entry_name;
    private $north_degree;
    private $north_minutes;
    private $north_seconds;
    private $east_degree;
    private $east_minutes;
    private $east_seconds;
    private $cog;
    private $sog;
    private $timestamp;
    private $btm;
    private $dtm;
    private $trip_to;
    private $maneuver_id;
    private $headsail_id;
    private $mainsail_id;

	/**
	 * Creats a logEntry from an associative array.
	 * @param A associative array with logEntry data, like the POST-Array.
	 * @return An instance of an logEntry.
	 */
    public function __construct($logEntryArray) {
    	$this->parse($logEntryArray);
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($logEntryArray) {

    	if (array_key_exists("id", $logEntryArray)) {
    		$this->id = mysql_real_escape_string($logEntryArray["id"]);
    	} else {
    		$this->id = -1;
    	}
	    
        $this->entry_name         = mysql_real_escape_string($logEntryArray["entry_name"]);
        $this->north_degree       = mysql_real_escape_string($logEntryArray["north_degree"]);
        $this->north_minutes      = mysql_real_escape_string($logEntryArray["north_minutes"]);
        $this->north_seconds      = mysql_real_escape_string($logEntryArray["north_seconds"]);
        $this->east_degree        = mysql_real_escape_string($logEntryArray["east_degree"]);
        $this->east_minutes       = mysql_real_escape_string($logEntryArray["east_minutes"]);
        $this->east_seconds       = mysql_real_escape_string($logEntryArray["east_seconds"]);
        $this->cog                = mysql_real_escape_string($logEntryArray["cog"]);
        $this->sog                = mysql_real_escape_string($logEntryArray["sog"]);
        $this->timestamp          = mysql_real_escape_string($logEntryArray["timestamp"]);
        $this->btm                = mysql_real_escape_string($logEntryArray["btm"]);
        $this->dtm                = mysql_real_escape_string($logEntryArray["dtm"]);
        $this->trip_to            = mysql_real_escape_string($logEntryArray["trip_to"]);
        $this->maneuver_id        = mysql_real_escape_string($logEntryArray["maneuver_id"]);
        $this->headsail_id        = mysql_real_escape_string($logEntryArray["headsail_id"]);
        $this->mainsail_id        = mysql_real_escape_string($logEntryArray["mainsail_id"]);
    }

    /**
     * Validates field values.
     * @return TRUE, if everything is valid.
     */
    private function validate() {
        if (!Valid::is_number($this->id, Valid::$REQ)) return FALSE;
        if (!Valid::is_required($this->entry_name)) return FALSE;
        if (!Valid::is_number_range($this->north_degree, -89, 89, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_range($this->north_minutes, -59, 59, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_range($this->north_seconds, -59, 59, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_range($this->east_degree, -179, 179, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_range($this->east_minutes, -59, 59, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_range($this->east_seconds, -59, 59, Valid::$REQ)) return FALSE;
        if (!Valid::is_number_min($this->cog, 0, Valid::$NOT_REQ)) return FALSE;
        if (!Valid::is_number_range($this->sog, 0, 360, Valid::$NOT_REQ)) return FALSE;
        //TODO: timestamp
        if (!Valid::is_number_range($this->btm, 0, 360, Valid::$NOT_REQ)) return FALSE;
        if (!Valid::is_number_min($this->dtm, 0, Valid::$NOT_REQ)) return FALSE;

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
     * Checks whether the logEntry is new or not.
     * @return Returns TRUE, if the logEntry is (ID == -1).
     */
    public function isNew() {
        return $this->id == -1;
    }

    /**
     * Indicates whether the logEntry is valid or not.
     * @return Returns TRUE if the logEntry is valid.
     */
    public function isValid () {
        return $this->validate();
    }

    /* Properties */

    public function getId() {
        return $this->id;
    }

    public function getTripId() {
        //TODO: Implement

        return 1;
    }

    public function getEntryName() {
        return $this->entry_name;
    }

    public function getNorthDegree() {
        return $this->north_degree;
    }
    
    public function getNorthMinutes() {
        return $this->north_minutes;
    }
    
    public function getNorthSeconds() {
        return $this->north_seconds;
    }
    
    public function getEastDegree() {
        return $this->east_degree;
    }
    
    public function getEastMinutes() {
        return $this->east_minutes;
    }
    
    public function getEastSeconds() {
        return $this->east_seconds;
    }
    
    public function getCog() {
        return $this->cog;
    }
    
    public function getSog() {
        return $this->sog;
    }
    
    public function getTimestamp() {
        return $this->timestamp;
    }
    
    public function getBtm() {
        return $this->btm;
    }
    
    public function getDtm() {
        return $this->dtm;
    }
    
    public function getTripTo() {
        return $this->trip_to;
    }
    
    public function getManeuverId() {
        return $this->maneuver_id;
    }
    
    public function getHeadsailId() {
        return $this->headsail_id;
    }
    
    public function getMainsailId() {
        return $this->mainsail_id;
    }

}

?>