package de.htwg.seapal;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.htwg.seapal.module.SeapalImplModule;
import de.htwg.seapal.module.SeapalMockModule;
import de.htwg.seapal.module.SeapalTestModule;
import de.htwg.seapal.utils.logging.ILogger;

import play.Application;
import play.GlobalSettings;

public class SeapalGlobal extends GlobalSettings {
	private final static Injector INJECTOR = createInjector();
	private final ILogger logger;
	
	public SeapalGlobal() {
		this.logger = INJECTOR.getInstance(ILogger.class);
	}
	
	/**
	 * Creates the Google Guice injector including its module descriptions.
	 * @return The Google Guice injector.
	 */
	public static Injector createInjector() {
		return Guice.createInjector(
				new SeapalImplModule());
	}
	
	@Override
	public <A> A getControllerInstance(Class<A> controllerClass)
			throws Exception {

		return INJECTOR.getInstance(controllerClass);
	}
	
	@Override
	public void onStart(Application app) {
		logger.info("GLOBAL", "Maps app has started");
	}
	
	@Override
	public void onStop(Application app) {
		logger.info("GLOBAL", "Maps app shutdown...");
	}
}
