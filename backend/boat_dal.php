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
            VALUES ('', '$boat->boat_name', '$boat->boat_type', '$boat->build_year', '$boat->register_nr', 
                '$boat->constructor', '$boat->engine', '$boat->sail_sign', '$boat->boat_length', '$boat->fueltank_size', '$boat->home_port', '$boat->boat_width',
                '$boat->watertank_size', '$boat->yachtclub', '$boat->draught', '$boat->wastewatertank_size', '$boat->owner', '$boat->mast_height', '$boat->mainsail_size',
                '$boat->insurance', '$boat->water_displacement', '$boat->genua_size', '$boat->callsign', '$boat->rig_kind', '$boat->spi_size')");
		$db->close();
		return $status;
	}

	/**
	 * Updates an existing boat in the database.
	 * @return TRUE, if the update operation was successfull.
	 */
	private static function update($boat) {
		$db = DBConnector::getConnection();
		$status = $db->queryExecute("UPDATE boat SET name='$boat->boat_name', boat_type='$boat->boat_type', build_year='$boat->build_year', register_nr='$boat->register_nr', 
                constructor='$boat->constructor', engine='$boat->engine', sail_sign='$boat->sail_sign', boat_length='$boat->boat_length', fueltank_size='$boat->fueltank_size', home_port='$boat->home_port', boat_width='$boat->boat_width', 
                watertank_size='$boat->watertank_size', yachtclub='$boat->yachtclub', draught='$boat->draught', wastewatertank_size='$boat->wastewatertank_size', owner='$boat->owner', mast_height='$boat->mast_height', mainsail_size='$boat->mainsail_size', 
                insurance='$boat->insurance', water_displacement='$boat->water_displacement', genua_size='$boat->genua_size', callsign='$boat->callsign', rig_kind='$boat->rig_kind', spi_size='$boat->spi_size'
                WHERE id='$boat->id'");
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