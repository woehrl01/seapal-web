<?php
require_once("boat.php");
require_once("database.php");

final class BoatDAL {

	private function __construct() {}

	/**
	 * Loads a boatwith a specific ID from the database.
	 * @return An instance of an boat or NULL.
	 */
	public static function loadById($boatId){
		$boat = NULL;
		$db = DBConnector::getConnection();
		$db->querySelect("SELECT id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size
                FROM boat
                WHERE id='$boatId'");

		$row = $db->getNextRow();
		
		if ($row) {
			$boat = new Boat($row);
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
		$db->querySelect("SELECT id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size
                FROM boat");

		while (TRUE) {
			$row = $db->getNextRow();

			if ($row == FALSE)
				break;

			$boat = new Boat($row);
			if ($boat->isValid()) {
				array_push($boats, $boat);
			}
		}

		$db->close();
		return $boats;
	}

	/**
	 * Saves or updates the boat to the database.
	 * @return TRUE, if the save operation was successfull.
	 */
    public static function save($boat) {
    	if ($boat->isValid()) {
    		if ($boat->isNew()) {
    			return BoatDAL::insert($boat);
    		}	
    		return update($boat);
    	}

    	return FALSE;
    }

    /**
     * Inserts a new boat to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($boat) {
		$db = DBConnector::getConnection();
		$status = $db->queryExecute("INSERT INTO boat (id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size)
            VALUES ('', '".$boat->getBoatName()."', '".$boat->getBoatType()."', '".$boat->getBuildYear()."', '".$boat->getRegisterNr()."', 
                '".$boat->getConstructor()."', '".$boat->getEngine()."', '".$boat->getSailSign()."', '".$boat->getBoatLength()."', '".$boat->getFueltankSize()."', '".$boat->getHomePort()."', '".$boat->getBoatWidth()."',
                '".$boat->getWatertankSize()."', '".$boat->getYachtclub()."', '".$boat->getDraught()."', '".$boat->getWastewatertankSize()."', '".$boat->getOwner()."', '".$boat->getMastHeight()."', '".$boat->getMainsailSize()."',
                '".$boat->getInsurance()."', '".$boat->getWaterDisplacement()."', '".$boat->getGenuaSize()."', '".$boat->getCallsign()."', '".$boat->getRigKind()."', '".$boat->getSpiSize()."')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing boat in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private static function update($boat) {
		$db = DBConnector::getConnection();
		$status = $db->queryExecute("UPDATE boat SET name='".$boat->getBoatName()."', boat_type='".$boat->getBoatType()."', build_year='".$boat->getBuildYear()."', register_nr='".$boat->getRegisterNr()."', 
                constructor='".$boat->getConstructor()."', engine='".$boat->getEngine()."', sail_sign='".$boat->getSailSign()."', boat_length='".$boat->getBoatLength()."', fueltank_size='".$boat->getFueltankSize()."', home_port='".$boat->getHomePort()."', boat_width='".$boat->getBoatWidth()."', 
                watertank_size='".$boat->getWatertankSize()."', yachtclub='".$boat->getYachtclub()."', draught='".$boat->getDraught()."', wastewatertank_size='".$boat->getWastewatertankSize()."', owner='".$boat->getOwner()."', mast_height='".$boat->getMastHeight()."', mainsail_size='".$boat->getMainsailSize()."', 
                insurance='".$boat->getInsurance()."', water_displacement='".$boat->getWaterDisplacement()."', genua_size='".$boat->getGenuaSize()."', callsign='".$boat->getCallsign()."', rig_kind='".$boat->getRigKind()."', spi_size='".$boat->getSpiSize()."'
                WHERE id='".$boat->getId()."'");
		$db->close();
		return $status;
	}

	/**
	 * Deletes a boat from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public static function delete($boatId) {
		$db = DBConnector::getConnection();
		$status = $db->queryExecute("DELETE FROM boat WHERE id='$boatId'");
		$db->close();

		return $status;
	}
}

?>