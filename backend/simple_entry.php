<?php

require_once("validator.php");

final class SimpleEntry implements JsonSerializable {
    private $id;
	private $name;

    /**
     * Creats a simple_entry from an associative array.
     * @param A associative array with simple_entry data, like the POST-Array.
     * @return An instance of an simple_entry.
     */
    public function __construct($entryArray) {
    	$this->parse($entryArray);
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($entryArray) {

    	if (array_key_exists("id", $entryArray)) {
    		$this->id = $entryArray["id"];
    	} else {
    		$this->id = -1;
    	}

    	$this->name = $entryArray["name"];
    }

    /**
     * Validates field values.
     * @return An array of invalid fields.
     */
    private function validate() {
        $errors = array();

        if (!Valid::is_number($this->id, Valid::$REQ)) array_push($errors, "id");
        if (!Valid::is_required($this->name)) array_push($errors, "name");

        return $errors;
    }

	/**
     * Indicates whether the boat is valid or not.
     * @return Returns TRUE if the boat is valid.
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

	// function called when encoded with json_encode
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }

    /* Properties */

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }
}

?>