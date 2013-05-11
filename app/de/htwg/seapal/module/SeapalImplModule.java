package de.htwg.seapal.module;

import org.ektorp.CouchDbConnector;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;

import com.google.inject.AbstractModule;
import com.google.inject.Key;
import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.database.impl.TripDatabase;
import de.htwg.seapal.database.impl.WaypointDatabase;

public class SeapalImplModule extends SeapalBaseModule {

	/**
	 * The trip database name.
	 */
	private static final String SEAPAL_TRIPS_DB = "seapal_trips_db";
	
	/**
	 * The waypoint database name.
	 */
	private static final String SEAPAL_WAYPOINT_DB = "seapal_waypoint_db";
	
	@Override
	protected void configure() {
		super.configure();
		
		configureTripDatabase();
		configureWaypointDatabase();
	}

	private void configureWaypointDatabase() {
		bind(String.class).annotatedWith(
				Names.named("databaseOfWaypoint")).toInstance(SEAPAL_WAYPOINT_DB);
		bind(IWaypointDatabase.class).to(WaypointDatabase.class);
		bind(CouchDbConnector.class).annotatedWith(
				Names.named("waypointCouchDbConnector")).to(
						Key.get(StdCouchDbConnector.class,
								Names.named("waypointCouchDbConnector")));
	}

	private void configureTripDatabase() {
		bind(String.class).annotatedWith(
				Names.named("databaseOfTrip")).toInstance(SEAPAL_TRIPS_DB);
		bind(ITripDatabase.class).to(TripDatabase.class);
		bind(CouchDbConnector.class).annotatedWith(
				Names.named("tripCouchDbConnector")).to(
						Key.get(StdCouchDbConnector.class,
								Names.named("tripCouchDbConnector")));
	}

	@Provides
	@Named("tripCouchDbConnector")
	StdCouchDbConnector getTripStdCouchDbConnector(@Named("databaseOfTrip") String databaseName, StdCouchDbInstance stdCouchDbInstance) {
		return new StdCouchDbConnector(databaseName, stdCouchDbInstance);
	}
	
	@Provides
	@Named("waypointCouchDbConnector")
	StdCouchDbConnector getWaypointStdCouchDbConnector(@Named("databaseOfWaypoint") String databaseName, StdCouchDbInstance stdCouchDbInstance) {
		return new StdCouchDbConnector(databaseName, stdCouchDbInstance);
	}
}
