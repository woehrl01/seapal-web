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

		$sql = sprintf("SELECT id, boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size
                FROM boat
                WHERE id='%s'",
                mysql_real_escape_string($boatId));

		$db->querySelect($sql);

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
            array_push($boats, $boat);
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
    		return BoatDAL::update($boat);
    	}
        
        return $boat->getErrors();
    }

    /**
     * Inserts a new boat to the database.
     * @return TRUE, if the insert operation was successfull.
     */
	private static function insert($boat) {
		$db = DBConnector::getConnection();
		$sql = sprintf("INSERT INTO boat (boat_name, boat_type, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size)
            	VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s',
                '%s', '%s', '%s', '%s', '%s', '%s', '%s','%s', '%s', '%s', '%s', '%s', '%s')",
				mysql_real_escape_string($boat->getBoatName()),
				mysql_real_escape_string($boat->getBoatType()),
				mysql_real_escape_string($boat->getBuildYear()),
				mysql_real_escape_string($boat->getRegisterNr()),
                mysql_real_escape_string($boat->getConstructor()),
                mysql_real_escape_string($boat->getEngine()),
                mysql_real_escape_string($boat->getSailSign()),
                mysql_real_escape_string($boat->getBoatLength()),
                mysql_real_escape_string($boat->getFueltankSize()),
                mysql_real_escape_string($boat->getHomePort()),
                mysql_real_escape_string($boat->getBoatWidth()),
                mysql_real_escape_string($boat->getWatertankSize()),
                mysql_real_escape_string($boat->getYachtclub()),
                mysql_real_escape_string($boat->getDraught()),
                mysql_real_escape_string($boat->getWastewatertankSize()),
                mysql_real_escape_string($boat->getOwner()),
                mysql_real_escape_string($boat->getMastHeight()),
                mysql_real_escape_string($boat->getMainsailSize()),
                mysql_real_escape_string($boat->getInsurance()),
                mysql_real_escape_string($boat->getWaterDisplacement()),
                mysql_real_escape_string($boat->getGenuaSize()),
                mysql_real_escape_string($boat->getCallsign()),
                mysql_real_escape_string($boat->getRigKind()),
                mysql_real_escape_string($boat->getSpiSize()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing boat in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private static function update($boat) {
		$db = DBConnector::getConnection();

		$sql = sprintf("UPDATE boat SET boat_name='%s', boat_type='%s', build_year='%s', register_nr='%s', 
                constructor='%s', engine='%s', sail_sign='%s', boat_length='%s', fueltank_size='%s', home_port='%s', boat_width='%s', 
                watertank_size='%s', yachtclub='%s', draught='%s', wastewatertank_size='%s', owner='%s', mast_height='%s', mainsail_size='%s', 
                insurance='%s', water_displacement='%s', genua_size='%s', callsign='%s', rig_kind='%s', spi_size='%s'
                WHERE id='%s'",
                mysql_real_escape_string($boat->getBoatName()),
                mysql_real_escape_string($boat->getBoatType()),
                mysql_real_escape_string($boat->getBuildYear()),
                mysql_real_escape_string($boat->getRegisterNr()), 
                mysql_real_escape_string($boat->getConstructor()),
                mysql_real_escape_string($boat->getEngine()),
                mysql_real_escape_string($boat->getSailSign()),
                mysql_real_escape_string($boat->getBoatLength()),
                mysql_real_escape_string($boat->getFueltankSize()),
                mysql_real_escape_string($boat->getHomePort()),
                mysql_real_escape_string($boat->getBoatWidth()),
                mysql_real_escape_string($boat->getWatertankSize()),
                mysql_real_escape_string($boat->getYachtclub()),
                mysql_real_escape_string($boat->getDraught()),
                mysql_real_escape_string($boat->getWastewatertankSize()),
                mysql_real_escape_string($boat->getOwner()),
                mysql_real_escape_string($boat->getMastHeight()),
                mysql_real_escape_string($boat->getMainsailSize()), 
                mysql_real_escape_string($boat->getInsurance()),
                mysql_real_escape_string($boat->getWaterDisplacement()),
                mysql_real_escape_string($boat->getGenuaSize()),
                mysql_real_escape_string($boat->getCallsign()),
                mysql_real_escape_string($boat->getRigKind()),
                mysql_real_escape_string($boat->getSpiSize()),
                mysql_real_escape_string($boat->getId()));

		$status = $db->queryExecute($sql);
		$db->close();
		return $status;
	}

	/**
	 * Deletes a boat from the database.
	 * @return TRUE, if the delete operation was successfull.
	 */
	public static function delete($boatId) {
		$db = DBConnector::getConnection();

		$sql = sprintf("DELETE FROM boat WHERE id='%s'",
			mysql_real_escape_string($boatId);

		$status = $db->queryExecute($sql);
		$db->close();

		return $status;
	}
}

?>