<?php
require_once("database.php");

final class Mainsail implements JsonSerializable {
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
    private function parse($mainsailArray) {

    	if (array_key_exists("id", $mainsailArray)) {
    		$this->id = mysql_real_escape_string($mainsailArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->name          = mysql_real_escape_string($mainsailArray["name"]);

	    $this->valid = TRUE;
    }

    /**
	 * Creats a mainsail from an associative array.
	 * @return An instance of an mainsail.
	 */
    public static function createFromArray($mainsailArray) {
    	$mainsail = new self();
    	$mainsail->parse($mainsailArray);
    	return $mainsail;
    }

	/**
	 * Loads a mainsail with a specific ID from the database.
	 * @return An instance of an mainsail.
	 */
	public static function loadById($mainsailId){
		$mainsail = new self();
		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM mainsail
                WHERE id='$mainsailId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$mainsail->parse($row);
		}
		
		$db->close();
		return $mainsail;
	}

	/**
	 * Loads all mainsails from the database.
	 * @return An array of mainsails.
	 */
	public static function loadAll() {
		$mainsails = array();

		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM mainsail");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$mainsail = new self();
			$mainsail->parse($row);
			array_push($mainsails, $mainsail);
		}

		$db->close();
		return $mainsails;
	}

	/**
	 * Saves or updates the mainsail to the database.
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
     * Saves a new mainsail to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private function saveNew() {
		$db = DBConnector::getConnection();
		$status = $db->query("INSERT INTO mainsail (id, name)
            VALUES ('', '$this->name')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing mainsail in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private function updateExisting() {
		$db = DBConnector::getConnection();
		$status = $db->query("UPDATE mainsail SET name='$this->name'
                WHERE id='$this->id'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a mainsail from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public function delete() {
		$db = DBConnector::getConnection();
		$status = $db->query("DELETE FROM mainsail WHERE id='$this->id'");
		$db->close();

		return $status;
	}

	/**
	 * Indicates whether the mainsail is valid or not.
	 * @return Returns TRUE if the mainsail is valid.
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