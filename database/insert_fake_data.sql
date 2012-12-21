-- Adminer 3.6.1 MySQL dump

SET NAMES utf8;
SET foreign_key_checks = 0;
SET time_zone = 'SYSTEM';
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

INSERT INTO `boat` (`id`, `boat_name`, `boat_type`, `build_year`, `register_nr`, `constructor`, `engine`, `sail_sign`, `boat_length`, `fueltank_size`, `home_port`, `boat_width`, `watertank_size`, `yachtclub`, `draught`, `wastewatertank_size`, `owner`, `mast_height`, `mainsail_size`, `insurance`, `water_displacement`, `genua_size`, `callsign`, `rig_kind`, `spi_size`) VALUES
(1,	'Titanic',	'Dampfer',	'1904',	'277382',	'',	'',	'',	100.000000,	0.000000,	'',	14.000000,	0.000000,	'',	0,	0,	'',	0.000000,	0.000000,	'',	0.000000,	0,	'',	'',	0.000000),
(2,	'St. Maria',	'Yacht',	'1980',	'33546',	'',	'',	'',	6.200000,	0.000000,	'',	3.400000,	0.000000,	'',	0,	0,	'',	0.000000,	0.000000,	'',	0.000000,	0,	'',	'',	0.000000),
(3, 'Rosetta', 'Yacht', '1955', '66434', '', '', '', 0.4, 0, '', 0.6, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', '', 0),
(4, 'Kanibalia', 'Skipper', '1904', '554123', '', '', '', 0.4, 0, '', 0.5, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', '', 0),
(5, 'St. Barbara', 'Frachter', '1982', '45563', '', '', '', 0.5, 0, '', 0.5, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', '', 0),
(6, 'St. Angelica', 'Ruderboot', '1975', '775564', '', '', '', 0.9, 0, '', 1.1, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', '', 0),
(7, 'St. Johanna', 'Yacht', '1960', '', '', '', '', 0, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', 0, 0, '', '', 0);

INSERT INTO `headsail` (`id`, `name`) VALUES
(1,	'-'),
(2,	'Fock'),
(3,	'Genua'),
(4,	'Spinnaker');

INSERT INTO `mainsail` (`id`, `name`) VALUES
(1,	'-'),
(2,	'Fock'),
(3,	'Grosssegel');

INSERT INTO `maneuver` (`id`, `name`) VALUES
(1,	'-'),
(2,	'Man over board (MOB)'),
(3,	'Wende'),
(4,	'Halse'),
(5,	'Aufschiesser');

INSERT INTO `mark` (`id`, `name`) VALUES
(1,	'-'),
(2,	'Markierung 1'),
(3,	'Markierung 2'),
(4,	'Markierung 3');

INSERT INTO `trip` (`id`, `boat_id`, `trip_title`, `trip_from`, `trip_to`, `start_time`, `end_time`, `engine_runtime`, `skipper`, `tank_filled`, `crew`, `note`) VALUES
(1,	1,	'Sonntagstrip',	'Konstanz',	'Friedrichshafen',	'2012-10-10 11:00:00',	'2012-10-10 16:00:00',	0,	'',	0,	'', ''),
(2, 1, 'Donnerstagstrip', 'Konstanz', 'Friedrichshafen', '2012-12-19 09:00:00', '2012-12-19 18:00:00', 0, '', 0, '', ''),
(3, 1, 'Segelkurs A', 'St. Petersburg', 'Hamburg', '2012-11-19 11:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(4, 1, 'Sonniger Tag', 'Konstanz', 'Überlingen', '2012-08-905 10:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(5, 2, 'Segelkurs B', 'Überlingen', 'Konstanz', '2012-11-13 09:30:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(6, 2, 'Segelkurs C', 'Meersburg', 'Konstanz', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(8, 2, 'Segelkurs D', 'Meersburg', 'Friedrichshafen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(9, 3, 'Testfahrt', 'Friedrichshafen', 'Meersburg', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(10, 3, 'Segelkurs A', 'Überlingen', 'Konstanz', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(11, 4, 'Segelkurs B', 'Bozen', 'Konstanz', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(12, 4, 'Segelkurs D', 'Bozen', 'Überlingen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', ''),
(13, 4, 'Segelkurs C', 'Friedrichshafen', 'Überlingen', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '', 0, '', '');


INSERT INTO `waypoint` (`id`, `entry_name`, `north_degree`, `north_minutes`, `north_seconds`, `east_degree`, `east_minutes`, `east_seconds`, `trip_id`, `cog`, `sog`, `datetime`, `btm`, `dtm`, `trip_to`, `maneuver_id`, `headsail_id`, `mainsail_id`, `note`) VALUES
(0, 'Rote Boje', 2.000000,   2.000000,   2.000000,   2.000000,   2.000000,   2.000000,   1,  '', '', '2012-04-18 00:00:00',  '', '', 1,  1,  1,  1,  ''),
(1, 'Sammelstelle', 2.000000,   2.000000,   2.000000,   2.000000,   2.000000,   2.000000,   1,  '', '', '2012-04-18 00:00:00',  '', '', 1,  1,  1,  1,  '');

-- 2012-12-21 01:27:59
