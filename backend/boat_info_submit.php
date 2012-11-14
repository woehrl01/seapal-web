<?php

    require_once('database.php');
	
    $boat_name          = $_POST["boat_name"];
    $boat_type          = $_POST["boat_type"];
    $build_year         = $_POST["build_year"];
    $register_nr        = $_POST["register_nr"];
    $constructor        = $_POST["constructor"];
    $engine             = $_POST["engine"];
    $sail_sign          = $_POST["sail_sign"];
    $length             = $_POST["length"];
    $fueltank_size      = $_POST["fueltank_size"];
    $home_port          = $_POST["home_port"];
    $width              = $_POST["width"];
    $watertank_size     = $_POST["watertank_size"];
    $draught            = $_POST["draught"];
    $yachtclub          = $_POST["yachtclub"];
    $wastewatertank_size= $_POST["wastewatertank_size"];
    $owner              = $_POST["owner"];
    $mast_height        = $_POST["mast_height"];
    $mainsail_size      = $_POST["mainsail_size"];
    $insurance          = $_POST["insurance"];
    $water_displacement = $_POST["water_displacement"];
    $genua_size         = $_POST["genua_size"];
    $callsign           = $_POST["callsign"];
    $genua_size         = $_POST["genua_size"];
    $rig_kind           = $_POST["rig_kind"];
    $spi_size           = $_POST["spi_size"];

    $db = DBConnector::getConnection();

    $db->query("INSERT INTO boat  (id, name, boat_typ, build_year, register_nr, 
                constructor, engine, sail_sign, boat_length, fueltank_size, home_port, boat_width, 
                watertank_size, yachtclub, draught, wastewatertank_size, owner, mast_height, mainsail_size, 
                insurance, water_displacement, genua_size, callsign, rig_kind, spi_size)
            VALUES ('', '$boat_name', '$boat_type', '$build_year', '$register_nr', 
                '$constructor', '$engine', '$sail_sign', '$length', '$fueltank_size', '$home_port', '$width',
                '$watertank_size', '$yachtclub', '$draught', '$wastewatertank_size', '$owner', '$mast_height', '$mainsail_size',
                '$insurance', '$water_displacement', '$genua_size', '$callsign', '$rig_kind', '$spi_size');");
				
    $db->close();

?>