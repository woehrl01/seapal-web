<?php
require_once("database.php");

final class Headsail implements JsonSerializable {
	private $id;
	private $name;

    // indicates whether the instance is valid or not.
    private $valid;

    private function __construct() {
    	$this->valid = FALSE;
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($headsailArray) {

    	if (array_key_exists("id", $headsailArray)) {
    		$this->id = mysql_real_escape_string($headsailArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->name          = mysql_real_escape_string($headsailArray["name"]);

	    $this->valid = TRUE;
    }

    /**
	 * Creats a headsail from an associative array.
	 * @return An instance of an headsail.
	 */
    public static function createFromArray($headsailArray) {
    	$headsail = new self();
    	$headsail->parse($headsailArray);
    	return $headsail;
    }

	/**
	 * Loads a headsail with a specific ID from the database.
	 * @return An instance of an headsail.
	 */
	public static function loadById($headsailId){
		$headsail = new self();
		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM headsail
                WHERE id='$headsailId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$headsail->parse($row);
		}
		
		$db->close();
		return $headsail;
	}

	/**
	 * Loads all headsails from the database.
	 * @return An array of headsails.
	 */
	public static function loadAll() {
		$headsails = array();

		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM headsail");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$headsail = new self();
			$headsail->parse($row);
			array_push($headsails, $headsail);
		}

		$db->close();
		return $headsails;
	}

	/**
	 * Saves or updates the headsail to the database.
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
     * Saves a new headsail to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private function saveNew() {
		$db = DBConnector::getConnection();
		$status = $db->query("INSERT INTO headsail (id, name)
            VALUES ('', '$this->name')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing headsail in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private function updateExisting() {
		$db = DBConnector::getConnection();
		$status = $db->query("UPDATE headsail SET name='$this->name'
                WHERE id='$this->id'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a headsail from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public function delete() {
		$db = DBConnector::getConnection();
		$status = $db->query("DELETE FROM headsail WHERE id='$this->id'");
		$db->close();

		return $status;
	}

	/**
	 * Indicates whether the headsail is valid or not.
	 * @return Returns TRUE if the headsail is valid.
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