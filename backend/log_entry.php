<?php

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

	    $this->valid = TRUE; // TODO: check, if the logEntry is really valid!
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
        return $this->valid;
    }

    /* Properties */

    public function getId() {
        return $this->id;
    }

    public function getEntryName() {
        return $this->entry_name;
    }

    public function getNorthDegree() {
        return $this->north_degree;
    }
    
    public function getNorthMinutes() {

    }
    
    public function getNorthSeconds() {

    }
    
    public function getEastDegree() {

    }
    
    public function getEastMinutes() {

    }
    
    public function getEastSeconds() {

    }
    
    public function getCog() {

    }
    
    public function getSog() {

    }
    
    public function getTimestamp() {

    }
    
    public function getBtm() {

    }
    
    public function getDtm() {

    }
    
    public function getTripTo() {

    }
    
    public function getManeuverId() {

    }
    
    public function getHeadsailId() {

    }
    
    public function getMainsailId() {

    }

}

?>