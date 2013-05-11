package de.htwg.seapal.module;

import org.ektorp.CouchDbConnector;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;

import com.google.inject.Key;
import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.database.impl.TripDatabase;

public class TripCouchDbModule extends CouchDbModule {
	private static final String SEAPAL_TRIPS_DB = "seapal_trips_db";

	@Override
	protected void configure() {
		super.configure();
		
		bind(String.class).annotatedWith(Names.named("databaseOfTrip"))
				.toInstance(SEAPAL_TRIPS_DB);
		
		bind(ITripDatabase.class).to(TripDatabase.class);
		
		bind(CouchDbConnector.class).annotatedWith(
				Names.named("tripCouchDbConnector")).to(
				Key.get(StdCouchDbConnector.class,
						Names.named("tripCouchDbConnector")));
	}

	@Provides
	@Named("tripCouchDbConnector")
	StdCouchDbConnector getStdCouchDbConnector(
			@Named("databaseOfTrip") String databaseName,
			StdCouchDbInstance stdCouchDbInstance) {
		return new StdCouchDbConnector(databaseName, stdCouchDbInstance);
	}
}
