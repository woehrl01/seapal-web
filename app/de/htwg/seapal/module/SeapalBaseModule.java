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
import de.htwg.seapal.controller.IRaceController;
import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.controller.impl.BoatController;
import de.htwg.seapal.controller.impl.RaceController;
import de.htwg.seapal.controller.impl.TripController;
import de.htwg.seapal.controller.impl.WaypointController;

public abstract class SeapalBaseModule extends AbstractModule {
	
	@Override
	protected void configure() {
		configureControllers();
		
		// configure database configuration
		bind(String.class).annotatedWith(Names.named("databaseHost")).toInstance("roroettg.iriscouch.com");
	    bind(Integer.class).annotatedWith(Names.named("databasePort")).toInstance(80);
	    bind(String.class).annotatedWith(Names.named("databaseURL")).toInstance("http://roroettg.iriscouch.com");
	}

	private void configureControllers() {
		bind(IBoatController.class).to(BoatController.class).in(Singleton.class);
		bind(ITripController.class).to(TripController.class).in(Singleton.class);
		bind(IWaypointController.class).to(WaypointController.class).in(Singleton.class);
		bind(IRaceController.class).to(RaceController.class).in(Singleton.class);
	}
	
	@Provides
    HttpClient getHttpClient(@Named("databaseHost") String databaseHost, @Named("databasePort") int databasePort) {
        return new StdHttpClient.Builder().host(databaseHost).port(databasePort).build();
    }

    @Provides
    CouchDbInstance getStdCouchDbInstance(HttpClient httpClient) {
        return new StdCouchDbInstance(httpClient);
    }
}
