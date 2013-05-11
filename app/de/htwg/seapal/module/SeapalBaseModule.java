package de.htwg.seapal.module;

import java.net.MalformedURLException;

import org.ektorp.CouchDbInstance;
import org.ektorp.http.HttpClient;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbInstance;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

import de.htwg.seapal.controller.IBoatController;
import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.controller.impl.BoatController;
import de.htwg.seapal.controller.impl.TripController;
import de.htwg.seapal.controller.impl.WaypointController;
import de.htwg.seapal.utils.logger.iml.WebLogger;
import de.htwg.seapal.utils.logging.ILogger;

public abstract class SeapalBaseModule extends AbstractModule {

	/**
	 * The database URL.
	 */
	private final static String DB_URL = "http://roroettg.iriscouch.com";
	
	/**
	 * The database host.
	 */
	private final static String DB_HOST = "roroettg.iriscouch.com";
	
	/**
	 * The database Port.
	 */
	private final static int DB_PORT = 80;
	
	@Override
	protected void configure() {
		bind(ILogger.class).to(WebLogger.class);
		bind(IBoatController.class).to(BoatController.class).in(Singleton.class);
		bind(ITripController.class).to(TripController.class).in(Singleton.class);
		bind(IWaypointController.class).to(WaypointController.class).in(Singleton.class);
		
		bind(String.class).annotatedWith(Names.named("databaseHost")).toInstance(DB_HOST);
	    bind(Integer.class).annotatedWith(Names.named("databasePort")).toInstance(DB_PORT);
	    bind(String.class).annotatedWith(Names.named("databaseURL")).toInstance(DB_URL);
	}
	
	@Provides
    HttpClient getHttpClient(@Named("databaseHost") String databaseHost, @Named("databasePort") int databasePort) {
        return new StdHttpClient.Builder().host(databaseHost).port(databasePort).build();
    }

    @Provides
    CouchDbInstance getStdCouchDbInstance(HttpClient httpClient) {
        return new StdCouchDbInstance(httpClient);
    }

    @Provides
	HttpClient getHttpClient(@Named("databaseURL") String databaseHost) {
		try {
			return new StdHttpClient.Builder().url(databaseHost).build();
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		}
	}
}
