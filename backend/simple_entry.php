<?php
require_once("database.php");

final class SimpleEntry implements JsonSerializable {
    private $valid;

    private $id;
	private $name;

    /**
     * Creats a simple_entry from an associative array.
     * @param A associative array with simple_entry data, like the POST-Array.
     * @return An instance of an simple_entry.
     */
    private function __construct($entryArray) {
    	$this->parse($entryArray);
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($entryArray) {

    	if (array_key_exists("id", $entryArray)) {
    		$this->id = mysql_real_escape_string($entryArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->name = mysql_real_escape_string($entryArray["name"]);

	    $this->valid = TRUE;
    }

	/**
	 * Indicates whether the maneuver is valid or not.
	 * @return Returns TRUE if the maneuver is valid.
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