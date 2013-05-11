package de.htwg.seapal.module;

import java.net.MalformedURLException;

import org.ektorp.http.HttpClient;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbInstance;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.google.inject.name.Names;

/**
 * The base couch DB module for Google Guice.
 */
public class CouchDbModule extends AbstractModule {

	/**
	 * The database URL.
	 */
	private final static String DB_URL = "http://roroettg.iriscouch.com";
	
	/**
	 * Indicates if the base configuration has already been done.
	 */
	private static boolean isAlreadyConfigured = false;
	
	@Override
	protected void configure() {
		// Ensure that the base configuration is only called once
		if (isAlreadyConfigured) {
			return;
		}
			
		bind(String.class).annotatedWith(Names.named("databaseURL"))
				.toInstance(DB_URL);
		
		isAlreadyConfigured = true;
	}

	@Provides
	HttpClient getHttpClient(@Named("databaseURL") String databaseHost) {
		try {
			return new StdHttpClient.Builder().url(databaseHost).build();
		} catch (MalformedURLException e) {
			throw new RuntimeException(e);
		}
	}

	@Provides
	StdCouchDbInstance getStdCouchDbInstance(HttpClient httpClient) {
		return new StdCouchDbInstance(httpClient);
	}
}
