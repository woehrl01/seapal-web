package de.htwg.seapal.module;

import com.google.inject.AbstractModule;

import de.htwg.seapal.controller.IBoatController;
import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.controller.impl.BoatController;
import de.htwg.seapal.controller.impl.TripController;
import de.htwg.seapal.controller.impl.WaypointController;
import de.htwg.seapal.utils.logger.iml.WebLogger;
import de.htwg.seapal.utils.logging.ILogger;

public abstract class SeapalBaseModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(ILogger.class).to(WebLogger.class);
		bind(IBoatController.class).to(BoatController.class);
		bind(ITripController.class).to(TripController.class);
		bind(IWaypointController.class).to(WaypointController.class);
	}

}
