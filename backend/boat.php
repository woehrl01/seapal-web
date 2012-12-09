<?php
require_once("database.php");

final class Boat implements JsonSerializable {
	private $id;
	private $boat_name;
    private $boat_type;
    private $build_year;
    private $register_nr;
    private $constructor;
    private $engine;
    private $sail_sign;
    private $length;
    private $fueltank_size;
    private $home_port;
    private $width;
    private $watertank_size;
    private $draught;
    private $yachtclub;
    private $wastewatertank_size;
    private $owner;
    private $mast_height;
    private $mainsail_size;
    private $insurance;
    private $water_displacement;
    private $genua_size;
    private $callsign;
    private $rig_kind;
    private $spi_size;

    // indicates whether the instance is valid or not.
    private $valid;

    private function __construct() {
    	$this->valid = FALSE;
    }

	/**
	 * Parses the associative array.
	 */
    private function parse($boatArray) {

    	if (array_key_exists("id", $boatArray)) {
    		$this->id = mysql_real_escape_string($boatArray["id"]);
    	} else {
    		$this->id = -1;
    	}

    	$this->boat_name          = mysql_real_escape_string($boatArray["boat_name"]);
	    $this->boat_type          = mysql_real_escape_string($boatArray["boat_type"]);
	    $this->build_year         = mysql_real_escape_string($boatArray["build_year"]);
	    $this->register_nr        = mysql_real_escape_string($boatArray["register_nr"]);
	    $this->constructor        = mysql_real_escape_string($boatArray["constructor"]);
	    $this->engine             = mysql_real_escape_string($boatArray["engine"]);
	    $this->sail_sign          = mysql_real_escape_string($boatArray["sail_sign"]);
	    $this->boat_length        = mysql_real_escape_string($boatArray["boat_length"]);
	    $this->fueltank_size      = mysql_real_escape_string($boatArray["fueltank_size"]);
	    $this->home_port          = mysql_real_escape_string($boatArray["home_port"]);
	    $this->boat_width         = mysql_real_escape_string($boatArray["boat_width"]);
	    $this->watertank_size     = mysql_real_escape_string($boatArray["watertank_size"]);
	    $this->draught            = mysql_real_escape_string($boatArray["draught"]);
	    $this->yachtclub          = mysql_real_escape_string($boatArray["yachtclub"]);
	    $this->wastewatertank_size= mysql_real_escape_string($boatArray["wastewatertank_size"]);
	    $this->owner              = mysql_real_escape_string($boatArray["owner"]);
	    $this->mast_height        = mysql_real_escape_string($boatArray["mast_height"]);
	    $this->mainsail_size      = mysql_real_escape_string($boatArray["mainsail_size"]);
	    $this->insurance          = mysql_real_escape_string($boatArray["insurance"]);
	    $this->water_displacement = mysql_real_escape_string($boatArray["water_displacement"]);
	    $this->genua_size         = mysql_real_escape_string($boatArray["genua_size"]);
	    $this->callsign           = mysql_real_escape_string($boatArray["callsign"]);
	    $this->genua_size         = mysql_real_escape_string($boatArray["genua_size"]);
	    $this->rig_kind           = mysql_real_escape_string($boatArray["rig_kind"]);
	    $this->spi_size           = mysql_real_escape_string($boatArray["spi_size"]);

	    $this->valid = TRUE;
    }

    /**
	 * Creats a boat from an associative array.
	 * @return An instance of an boat.
	 */
    public static function createFromArray($boatArray) {
    	$boat = new self();
    	$boat->parse($boatArray);
    	return $boat;
    }

	/**
	 * Loads a boatwith a specific ID from the database.
	 * @return An instance of an boat.
	 */
	public static function loadById($boatId){
		$boat = new self();
		$db = DBConnector::getConnection();
		$db->query("SELECT id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size
                FROM boat
                WHERE id='$boatId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$boat->parse($row);
		}
		
		$db->close();
		return $boat;
	}

	/**
	 * Loads all boats from the database.
	 * @return An array of boats.
	 */
	public static function loadAll() {
		$boats = array();

		$db = DBConnector::getConnection();
		$db->query("SELECT id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size
                FROM boat");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$boat = new self();
			$boat->parse($row);
			array_push($boats, $boat);
		}

		$db->close();
		return $boats;
	}

	/**
	 * Saves or updates the boat to the database.
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
     * Saves a new boat to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private function saveNew() {
		$db = DBConnector::getConnection();
		$status = $db->query("INSERT INTO boat (id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size)
            VALUES ('', '$this->boat_name', '$this->boat_type', '$this->build_year', '$this->register_nr', 
                '$this->constructor', '$this->engine', '$this->sail_sign', '$this->boat_length', '$this->fueltank_size', '$this->home_port', '$this->boat_width',
                '$this->watertank_size', '$this->yachtclub', '$this->draught', '$this->wastewatertank_size', '$this->owner', '$this->mast_height', '$this->mainsail_size',
                '$this->insurance', '$this->water_displacement', '$this->genua_size', '$this->callsign', '$this->rig_kind', '$this->spi_size')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing boat in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private function updateExisting() {
		$db = DBConnector::getConnection();
		$status = $db->query("UPDATE boat SET name='$this->boat_name', boat_type='$this->boat_type', build_year='$this->build_year', register_nr='$this->register_nr', 
                constructor='$this->constructor', engine='$this->engine', sail_sign='$this->sail_sign', boat_length='$this->boat_length', fueltank_size='$this->fueltank_size', home_port='$this->home_port', boat_width='$this->boat_width', 
                watertank_size='$this->watertank_size', yachtclub='$this->yachtclub', draught='$this->draught', wastewatertank_size='$this->wastewatertank_size', owner='$this->owner', mast_height='$this->mast_height', mainsail_size='$this->mainsail_size', 
                insurance='$this->insurance', water_displacement='$this->water_displacement', genua_size='$this->genua_size', callsign='$this->callsign', rig_kind='$this->rig_kind', spi_size='$this->spi_size'
                WHERE id='$this->id'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a boat from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public function delete() {
		$db = DBConnector::getConnection();
		$status = $db->query("DELETE FROM boat WHERE id='$this->id'");
		$db->close();

		return $status;
	}

	/**
	 * Indicates whether the boat is valid or not.
	 * @return Returns TRUE if the boat is valid.
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