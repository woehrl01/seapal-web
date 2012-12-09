<?php
require_once("database.php");

final class Maneuver implements JsonSerializable {
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
    private function parse($maneuverArray) {

    	if (array_key_exists("id", $maneuverArray)) {
    		$this->id = mysql_real_escape_string($maneuverArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->name          = mysql_real_escape_string($maneuverArray["name"]);

	    $this->valid = TRUE;
    }

    /**
	 * Creats a maneuver from an associative array.
	 * @return An instance of an maneuver.
	 */
    public static function createFromArray($maneuverArray) {
    	$maneuver = new self();
    	$maneuver->parse($maneuverArray);
    	return $maneuver;
    }

	/**
	 * Loads a maneuver with a specific ID from the database.
	 * @return An instance of an maneuver.
	 */
	public static function loadById($maneuverId){
		$maneuver = new self();
		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM maneuver
                WHERE id='$maneuverId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$maneuver->parse($row);
		}
		
		$db->close();
		return $maneuver;
	}

	/**
	 * Loads all maneuvers from the database.
	 * @return An array of maneuvers.
	 */
	public static function loadAll() {
		$maneuvers = array();

		$db = DBConnector::getConnection();
		$db->query("SELECT id, name
                FROM maneuver");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$maneuver = new self();
			$maneuver->parse($row);
			array_push($maneuvers, $maneuver);
		}

		$db->close();
		return $maneuvers;
	}

	/**
	 * Saves or updates the maneuver to the database.
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
     * Saves a new maneuver to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private function saveNew() {
		$db = DBConnector::getConnection();
		$status = $db->query("INSERT INTO maneuver (id, name)
            VALUES ('', '$this->name')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing maneuver in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private function updateExisting() {
		$db = DBConnector::getConnection();
		$status = $db->query("UPDATE maneuver SET name='$this->name'
                WHERE id='$this->id'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a maneuver from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public function delete() {
		$db = DBConnector::getConnection();
		$status = $db->query("DELETE FROM maneuver WHERE id='$this->id'");
		$db->close();

		return $status;
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