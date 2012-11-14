CREATE TABLE IF NOT EXISTS person(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	
	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS boat(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name varchar(20) NOT NULL,
	boat_typ varchar(20) NOT NULL,
	build_year varchar(4) NOT NULL,
	register_nr varchar(20) NOT NULL,
	constructor varchar(20) NOT NULL,
	engine varchar(20) NOT NULL,
	sail_sign varchar(10) NOT NULL,
	boat_length float NOT NULL,
	fueltank_size float NOT NULL,
	home_port varchar(20) NOT NULL,
	boat_width float NOT NULL,
	watertank_size float NOT NULL,
	yachtclub varchar(20) NOT NULL,
	draught float NOT NULL,
	wastewatertank_size float NOT NULL,
	owner varchar(20) NOT NULL,
	mast_height float NOT NULL,
	mainsail_size float NOT NULL,
	insurance varchar(20) NOT NULL,
	water_displacement float NOT NULL,
	genua_size float NOT NULL,
	callsign varchar(10) NOT NULL,
	rig_kind varchar(10) NOT NULL,
	spi_size float NOT NULL,
	
	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS trip(
	id INTEGER NOT NULL AUTO_INCREMENT,
	boat_ID INTEGER NOT NULL,
	title varchar(20) NOT NULL,
	trip_from varchar(20) NOT NULL,
	trip_to varchar(20) NOT NULL,
	start_time timestamp NOT NULL,
	end_time timestamp NOT NULL,
	engine_runtime integer NOT NULL,
	skipper varchar(20) NOT NULL,
	tank_filled integer NOT NULL,
	
	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS crew_on_trip(
	person_id INTEGER NOT NULL,
	trip_id INTEGER NOT NULL,
	 
	FOREIGN KEY (person_id) references  person(id),
	FOREIGN KEY (trip_id) references  trip(id)
);

CREATE TABLE IF NOT EXISTS maneuver(
	id INTEGER NOT NULL AUTO_INCREMENT,
	name INTEGER NOT NULL,

	PRIMARY KEY (id),
	UNIQUE KEY (id)
);

CREATE TABLE IF NOT EXISTS waypoint(
	id INTEGER NOT NULL,
	longitude float(10,6) NOT NULL,
	latitude float(10,6) NOT NULL,
	trip_id INTEGER NOT NULL,
	cog VARCHAR(3) NOT NULL,
	sog VARCHAR(3) NOT NULL,
	time timestamp NOT NULL,
	BTM varchar(10) NOT NULL,
	DTM varchar(10) NOT NULL,
	trip_to integer NOT NULL,
	maneuver_id integer NOT NULL,
	headsail_id integer NOT NULL,
	mainsail_id integer NOT NULL,
	
	PRIMARY KEY (id),
	FOREIGN KEY (trip_id) references trip(id),
	FOREIGN KEY (maneuver_id) references maneuver(id)
);
