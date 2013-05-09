package de.htwg.seapal.module;

import com.google.inject.AbstractModule;

import de.htwg.seapal.utils.logger.iml.WebLogger;
import de.htwg.seapal.utils.logging.ILogger;

public abstract class SeapalBaseModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(ILogger.class).to(WebLogger.class);
	}

}
