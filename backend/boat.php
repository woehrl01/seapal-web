<?php

require_once("validator.php");

final class Boat implements JsonSerializable {
    private $id;
	private $boat_name;
    private $boat_type;
    private $build_year;
    private $register_nr;
    private $constructor;
    private $engine;
    private $sail_sign;
    private $boat_length;
    private $fueltank_size;
    private $home_port;
    private $boat_width;
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
    		$this->id = $boatArray["id"];
    	} else {
    		$this->id = -1;
    	}

    	$this->boat_name          = $boatArray["boat_name"];
	    $this->boat_type          = $boatArray["boat_type"];
	    $this->build_year         = $boatArray["build_year"];
	    $this->register_nr        = $boatArray["register_nr"];
	    $this->constructor        = $boatArray["constructor"];
	    $this->engine             = $boatArray["engine"];
	    $this->sail_sign          = $boatArray["sail_sign"];
	    $this->boat_length        = $boatArray["boat_length"];
	    $this->fueltank_size      = $boatArray["fueltank_size"];
	    $this->home_port          = $boatArray["home_port"];
	    $this->boat_width         = $boatArray["boat_width"];
	    $this->watertank_size     = $boatArray["watertank_size"];
	    $this->draught            = $boatArray["draught"];
	    $this->yachtclub          = $boatArray["yachtclub"];
	    $this->wastewatertank_size= $boatArray["wastewatertank_size"];
	    $this->owner              = $boatArray["owner"];
	    $this->mast_height        = $boatArray["mast_height"];
	    $this->mainsail_size      = $boatArray["mainsail_size"];
	    $this->insurance          = $boatArray["insurance"];
	    $this->water_displacement = $boatArray["water_displacement"];
	    $this->genua_size         = $boatArray["genua_size"];
	    $this->callsign           = $boatArray["callsign"];
	    $this->genua_size         = $boatArray["genua_size"];
	    $this->rig_kind           = $boatArray["rig_kind"];
	    $this->spi_size           = $boatArray["spi_size"];
    }

    /**
     * Validates field values.
     * @return An array of invalid fields.
     */
    private function validate() {
        $errors = array();

        if (!Valid::is_number($this->id, Valid::$REQ)) array_push($errors, "id");
        if (!Valid::is_required($this->boat_name)) array_push($errors, "boat_name");
        if (!Valid::is_number_min($this->build_year, 1900, Valid::$NOT_REQ)) array_push($errors, "build_year");
        if (!Valid::is_number($this->register_nr, Valid::$NOT_REQ)) array_push($errors, "register_nr");
        if (!Valid::is_number_min($this->boat_length, 0.1, Valid::$NOT_REQ)) array_push($errors, "boat_length");
        if (!Valid::is_number_min($this->fueltank_size, 0, Valid::$NOT_REQ)) array_push($errors, "fueltank_size");
        if (!Valid::is_number_min($this->boat_width, 0.1, Valid::$NOT_REQ)) array_push($errors, "boat_width");
        if (!Valid::is_number_min($this->watertank_size, 0, Valid::$NOT_REQ)) array_push($errors, "watertank_size");
        if (!Valid::is_number_min($this->draught, 0, Valid::$NOT_REQ)) array_push($errors, "draught");
        if (!Valid::is_number_min($this->wastewatertank_size, 0, Valid::$NOT_REQ)) array_push($errors, "wastewatertank_size");
        if (!Valid::is_number_min($this->mast_height, 0, Valid::$NOT_REQ)) array_push($errors, "mast_height");
        if (!Valid::is_number_min($this->mainsail_size, 0, Valid::$NOT_REQ)) array_push($errors, "mainsail_size");
        if (!Valid::is_number_min($this->water_displacement, 0, Valid::$NOT_REQ)) array_push($errors, "water_displacement");
        if (!Valid::is_number_min($this->genua_size, 0, Valid::$NOT_REQ)) array_push($errors, "genua_size");
        if (!Valid::is_number_min($this->spi_size, 0, Valid::$NOT_REQ)) array_push($errors, "spi_size");

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

    public function getBoatName() {
        return $this->boat_name;
    }

    public function getBoatType() {
        return $this->boat_type;
    }

    public function getBuildYear() {
        return $this->build_year;
    }

    public function getRegisterNr() {
        return $this->register_nr;
    }

    public function getConstructor() {
        return $this->constructor;
    }

    public function getEngine() {
        return $this->engine;
    }

    public function getSailSign() {
        return $this->sail_sign;
    }

    public function getBoatLength() {
        return $this->boat_length;
    }

    public function getFueltankSize() {
        return $this->fueltank_size;
    }

    public function getHomePort() {
        return $this->home_port;
    }

    public function getBoatWidth() {
        return $this->boat_width;
    }

    public function getWatertankSize() {
        return $this->watertank_size;
    }

    public function getDraught() {
        return $this->draught;
    }

    public function getYachtclub() {
        return $this->yachtclub;
    }

    public function getWastewatertankSize() {
        return $this->wastewatertank_size;
    }

    public function getOwner() {
        return $this->owner;
    }

    public function getMastHeight() {
        return $this->mast_height;
    }

    public function getMainsailSize() {
        return $this->mainsail_size;
    }

    public function getInsurance() {
        return $this->insurance;
    }

    public function getWaterDisplacement() {
        return $this->water_displacement;
    }

    public function getGenuaSize() {
        return $this->genua_size;
    }

    public function getCallsign() {
        return $this->callsign;
    }

    public function getRigKind() {
        return $this->rig_kind;
    }

    public function getSpiSize() {
        return $this->spi_size;
    }

}

?>