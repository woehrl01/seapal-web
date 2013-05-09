package de.htwg.seapal.module;

import de.htwg.seapal.database.*;

public class SeapalMockModule extends SeapalBaseModule {
	
	@Override
	protected void configure() {
		super.configure();
		
		configureDatabase();
	}

	private void configureDatabase() {
		bind(IBoatDatabase.class).to(de.htwg.seapal.database.mock.BoatDatabase.class);
		bind(IPersonDatabase.class).to(de.htwg.seapal.database.mock.PersonDatabase.class);
		bind(ITripDatabase.class).to(de.htwg.seapal.database.mock.TripDatabase.class);
		bind(IMarkDatabase.class).to(de.htwg.seapal.database.mock.MarkDatabase.class);
		bind(IWaypointDatabase.class).to(de.htwg.seapal.database.mock.WaypointDatabase.class);
		bind(IRouteDatabase.class).to(de.htwg.seapal.database.mock.RouteDatabase.class);
	}
}
