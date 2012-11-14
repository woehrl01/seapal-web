CREATE TABLE person(
	id INTEGER,
	name VARCHAR(20),

	PRIMARY KEY (id)
);

CREATE TABLE boat(
	id INTEGER,
	name varchar(20),
	boat_typ varchar(20),
	build_year varchar(4),
	register_nr varchar(20),
	constructor varchar(20),
	engine varchar(20),
	sail_sign varchar(10),
	boat_length float,
	fueltank_size float,
	home_port varchar(20),
	boat_width float,
	watertank_size float,
	yachtclub varchar(20),
	draught float,
	wastewatertank_size float,
	owner varchar(20),
	mast_height float,
	mainsail_size float,
	insurance varchar(20),
	water_displacement float,
	genua_size float,
	callsign varchar(10),
	rig_kind varchar(10),
	spi_size float,
	
	PRIMARY KEY (id)
);

CREATE TABLE trip(
	id INTEGER,
	boat_ID INTEGER,
	title varchar(20),
	trip_from varchar(20),
	trip_to varchar(20),
	start_time timestamp,
	end_time timestamp,
	engine_runtime integer,
	skipper varchar(20),
	tank_filled integer,
	
	PRIMARY KEY (id)
);

CREATE TABLE crew_on_trip(
	person_id INTEGER,
	trip_id INTEGER,
	 
	FOREIGN KEY (person_id) references  person(id),
	FOREIGN KEY (trip_id) references  trip(id)
);

CREATE TABLE maneuver(
	id INTEGER,
	name INTEGER,

	PRIMARY KEY (id)
);

CREATE TABLE waypoint(
	id INTEGER,
	longitude float(10,6),
	latitude float(10,6),
	trip_id INTEGER,
	cog VARCHAR(3),
	sog VARCHAR(3),
	time timestamp,
	BTM varchar(10),
	DTM varchar(10),
	trip_to integer,
	maneuver_id integer,
	headsail_id integer,
	mainsail_id integer,
	
	PRIMARY KEY (id),
	FOREIGN KEY (trip_id) references trip(id),
	FOREIGN KEY (maneuver_id) references maneuver(id)
);
