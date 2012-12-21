CREATE TABLE IF NOT EXISTS boat(
	id INTEGER NOT NULL AUTO_INCREMENT,
	boat_name varchar(20) NOT NULL,
	boat_type varchar(20) NOT NULL,
	build_year varchar(4) NOT NULL,
	register_nr varchar(20) NOT NULL,
	constructor varchar(20) NOT NULL,
	engine varchar(20) NOT NULL,
	sail_sign varchar(10) NOT NULL,
	boat_length float(10,6) NOT NULL,
	fueltank_size float(10,6) NOT NULL,
	home_port varchar(20) NOT NULL,
	boat_width float(10,6) NOT NULL,
	watertank_size float(10,6) NOT NULL,
	yachtclub varchar(20) NOT NULL,
	draught float NOT NULL,
	wastewatertank_size float NOT NULL,
	owner varchar(20) NOT NULL,
	mast_height float(10,6) NOT NULL,
	mainsail_size float(10,6) NOT NULL,
	insurance varchar(20) NOT NULL,
	water_displacement float(10,6) NOT NULL,
	genua_size float NOT NULL,
	callsign varchar(10) NOT NULL,
	rig_kind varchar(10) NOT NULL,
	spi_size float(10,6) NOT NULL,
	
	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS trip(
	id INTEGER NOT NULL AUTO_INCREMENT,
	boat_id INTEGER NOT NULL,
	trip_title varchar(20) NOT NULL,
	trip_from varchar(20) NOT NULL,
	trip_to varchar(20) NOT NULL,
	start_time timestamp NOT NULL,
	end_time timestamp NOT NULL,
	engine_runtime integer NOT NULL,
	skipper varchar(20) NOT NULL,
	tank_filled bool NOT NULL,
	crew varchar(128) NOT NULL,
	note varchar(512) NOT NULL,
	
	PRIMARY KEY (id),
	FOREIGN KEY (boat_id) references boat(id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS maneuver(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,

	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS headsail(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,

	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS mainsail(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,

	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS mark (
	id INTEGER NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,

	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS waypoint(
	id INTEGER NOT NULL,
	entry_name varchar(32) NOT NULL,
	north_degree float(10,6) NOT NULL,
	north_minutes float(10,6) NOT NULL,
	north_seconds float(10,6) NOT NULL,
	east_degree float(10,6) NOT NULL,
	east_minutes float(10,6) NOT NULL,
	east_seconds float(10,6) NOT NULL,
	trip_id INTEGER NOT NULL,
	cog VARCHAR(3) NOT NULL,
	sog VARCHAR(3) NOT NULL,
	datetime timestamp NOT NULL,
	btm varchar(10) NOT NULL,
	dtm varchar(10) NOT NULL,
	trip_to integer NOT NULL,
	maneuver_id integer NOT NULL,
	headsail_id integer NOT NULL,
	mainsail_id integer NOT NULL,
	note varchar(512) NOT NULL,
	
	PRIMARY KEY (id),
	FOREIGN KEY (trip_id) references trip(id),
	FOREIGN KEY (trip_to) references mark(id),
	FOREIGN KEY (maneuver_id) references maneuver(id),
	FOREIGN KEY (headsail_id) references headsail(id),
	FOREIGN KEY (mainsail_id) references mainsail(id),
	UNIQUE KEY (id)
);
