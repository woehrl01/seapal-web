package de.htwg.seapal.web.views.content;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.inject.Injector;

import de.htwg.seapal.SeapalGlobal;
import de.htwg.seapal.database.IMarkDatabase;
import de.htwg.seapal.model.IMark;
import de.htwg.seapal.model.IWaypoint.ForeSail;
import de.htwg.seapal.model.IWaypoint.MainSail;
import de.htwg.seapal.model.IWaypoint.Maneuver;
import de.htwg.seapal.utils.logging.ILogger;

public class DropdownContent {
	
	/**
	 * The Google Guice Injector
	 */
	public static Injector INJECTOR = SeapalGlobal.createInjector();
	
	private final static ILogger logger = INJECTOR.getInstance(ILogger.class);
	
	/**
	 * Gets all maneuver options.
	 * @return All maneuver options.
	 */
	public static List<String> getManeuverOptions() {
		List<String> options = new ArrayList<String>();
    	for(Maneuver value : Maneuver.values()) {
    		options.add(value.toString());
    	}
    	return options;
	}
	
	/**
	 * Gets all foresail options.
	 * @return All foresail options.
	 */
	public static List<String> getForeSailOptions() {
		List<String> options = new ArrayList<String>();
    	for(ForeSail value : ForeSail.values()) {
    		options.add(value.toString());
    	}
    	return options;
	}
	
	/**
	 * Gets all mainsail options.
	 * @return All mainsail options.
	 */
	public static List<String> getMainSailOptions() {
		List<String> options = new ArrayList<String>();
    	for(MainSail value : MainSail.values()) {
    		options.add(value.toString());
    	}
    	return options;
	}
	
	/**
	 * Gets all headed for options, which contains UUID and name of a mark.
	 * @return All mark UUIDs and names.
	 */
	public static Map<String, String> getHeadedForOptions() {
		Map<String, String> options = new HashMap<String, String>();
		IMarkDatabase markDatabase = INJECTOR.getInstance(IMarkDatabase.class);
		
		for (IMark mark : markDatabase.loadAll()) {
			options.put(mark.getId(), mark.getName());
		}
		
		logger.info("DropdownContent", "getHeadedForOptions count: " + options.size());
		
		return options;
	}
}
