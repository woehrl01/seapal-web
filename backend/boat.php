<?php

final class Boat implements JsonSerializable {
	public $id;
	public $boat_name;
    public $boat_type;
    public $build_year;
    public $register_nr;
    public $constructor;
    public $engine;
    public $sail_sign;
    public $length;
    public $fueltank_size;
    public $home_port;
    public $width;
    public $watertank_size;
    public $draught;
    public $yachtclub;
    public $wastewatertank_size;
    public $owner;
    public $mast_height;
    public $mainsail_size;
    public $insurance;
    public $water_displacement;
    public $genua_size;
    public $callsign;
    public $rig_kind;
    public $spi_size; // TODO: geter/setter + private members?

    private $valid;

	/**
	 * Creats a boat from an associative array.
	 * @param A associative array with boat data, like the POST-Array.
	 * @return An instance of an boat.
	 */
    public function __construct($boatArray) {
    	$this->parse($boatArray);
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

	    $this->valid = TRUE; // TODO: check, if the boat is really valid!
    }

    /**
     * Checks whether the boat is new or not.
     * @return Returns TRUE, if the boat is (ID == -1).
     */
    public function isNew() {
    	return $this->id == -1;
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