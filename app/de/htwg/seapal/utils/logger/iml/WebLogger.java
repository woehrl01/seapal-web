package de.htwg.seapal.utils.logger.iml;

import play.Logger;

import de.htwg.seapal.utils.logging.ILogger;

public class WebLogger implements ILogger {

	private static final String LOG_FORMAT = "[%s]: %s";
	
	@Override
	public void error(String tag, String msg) {
		Logger.error(String.format(LOG_FORMAT, tag, msg));
	}

	@Override
	public void info(String tag, String msg) {
		Logger.info(String.format(LOG_FORMAT, tag, msg));
	}

	@Override
	public void warn(String tag, String msg) {
		Logger.warn(String.format(LOG_FORMAT, tag, msg));
	}
}
