package de.htwg.seapal.module;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.impl.StdCouchDbConnector;

import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import de.htwg.seapal.database.IBoatDatabase;
import de.htwg.seapal.database.IMarkDatabase;
import de.htwg.seapal.database.IPersonDatabase;
import de.htwg.seapal.database.IRouteDatabase;
import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.database.impl.TripDatabase;
import de.htwg.seapal.database.impl.WaypointDatabase;

public class SeapalImplModule extends SeapalBaseModule {

	@Override
	protected void configure() {
		super.configure();
		
		bind(IBoatDatabase.class).to(de.htwg.seapal.database.mock.BoatDatabase.class);
		bind(IPersonDatabase.class).to(de.htwg.seapal.database.mock.PersonDatabase.class);
		bind(IMarkDatabase.class).to(de.htwg.seapal.database.mock.MarkDatabase.class);
		bind(IRouteDatabase.class).to(de.htwg.seapal.database.mock.RouteDatabase.class);
		
		bind(String.class).annotatedWith(Names.named("databaseOfWaypoint")).toInstance("seapal_waypoint_db");
		bind(IWaypointDatabase.class).to(WaypointDatabase.class);
		bind(String.class).annotatedWith(Names.named("databaseOfTrip")).toInstance("seapal_trips_db");
		bind(ITripDatabase.class).to(TripDatabase.class);
	}

	@Provides
	@Named("tripCouchDbConnector")
	CouchDbConnector getTripStdCouchDbConnector(@Named("databaseOfTrip") String databaseName, CouchDbInstance couchDbInstance) {
		return new StdCouchDbConnector(databaseName, couchDbInstance);
	}
	
	@Provides
	@Named("waypointCouchDbConnector")
	CouchDbConnector getWaypointStdCouchDbConnector(@Named("databaseOfWaypoint") String databaseName, CouchDbInstance couchDbInstance) {
		return new StdCouchDbConnector(databaseName, couchDbInstance);
	}
}
