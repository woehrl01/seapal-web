package de.htwg.seapal.module;

import org.ektorp.CouchDbConnector;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;

import com.google.inject.Key;
import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.database.impl.WaypointDatabase;

public class WaypointCouchDbModule extends CouchDbModule {
	private static final String SEAPAL_WAYPOINT_DB = "seapal_waypoint_db";

	@Override
	protected void configure() {
		super.configure();

		bind(String.class).annotatedWith(Names.named("databaseOfWaypoint"))
				.toInstance(SEAPAL_WAYPOINT_DB);

		bind(IWaypointDatabase.class).to(WaypointDatabase.class);

		bind(CouchDbConnector.class).annotatedWith(
				Names.named("waypointCouchDbConnector")).to(
				Key.get(StdCouchDbConnector.class,
						Names.named("waypointCouchDbConnector")));
	}

	@Provides
	@Named("waypointCouchDbConnector")
	StdCouchDbConnector getStdCouchDbConnector(
			@Named("databaseOfWaypoint") String databaseName,
			StdCouchDbInstance stdCouchDbInstance) {
		return new StdCouchDbConnector(databaseName, stdCouchDbInstance);
	}
}
