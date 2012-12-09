<?php

    require_once('database.php');

	//TODO: avoid injections with mysql_real_escape_string
	
    $entry_name         = $_POST["entry_name"];
    $north_degree       = $_POST["north_degree"];
    $north_minutes      = $_POST["north_minutes"];
    $north_seconds      = $_POST["north_seconds"];
    $east_degree        = $_POST["east_degree"];
    $east_minutes       = $_POST["east_minutes"];
    $east_seconds       = $_POST["east_seconds"];
    $cog                = $_POST["cog"];
    $sog                = $_POST["sog"];
    $timestamp          = $_POST["timestamp"];
    $btm                = $_POST["btm"];
    $dtm                = $_POST["dtm"];
    $trip_to            = $_POST["trip_to"];
    $maneuver           = $_POST["maneuver"];
    $headsail_id        = $_POST["headsail"];
    $mainsail           = $_POST["mainsail"];

    $longitude = $north_degree; //calc
    $latitute  = $east_degree; //calc

    $db = DBConnector::getConnection();

    $db->query("INSERT INTO waypoint  (id, longitude, latitute, trip_id, cog, sog, datetime, btm, dtm, trip_to, manuever_id, headsail_id, mainsail_id)
            VALUES (1, $longitude, $latitute, $trip_to, $cog, $sog, $timestamp, $btm, $dtm, $trip_to, $maneuver, $headsail_id, $mainsail);");

    $db->close();    

?>