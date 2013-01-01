package controllers.helpers;

import java.util.List;
import java.util.LinkedList;

public class HeaderHelper {

	public static String filename = ""; //Http.Request.current().url; ???

	public static String renderNavigation() {
		StringBuilder sb = new StringBuilder();

		List<String> start_hrefs = new LinkedList<String>();
		start_hrefs.add("");

		List<String> howto_hrefs = new LinkedList<String>();
		howto_hrefs.add("user_guide");

		List<String> screenshots_hrefs = new LinkedList<String>();
		screenshots_hrefs.add("user_guide");

		List<String> team_hrefs = new LinkedList<String>();
		team_hrefs.add("about");

		List<String> contact_hrefs = new LinkedList<String>();
		contact_hrefs.add("contact");

		List<String> webapp_hrefs = new LinkedList<String>();
		webapp_hrefs.add("boat_info");
		webapp_hrefs.add("log_entry");
		webapp_hrefs.add("trip_info");
		webapp_hrefs.add("seamap");

		sb.append(renderNavigationEntry("Start", start_hrefs));
		sb.append(renderNavigationEntry("How To", howto_hrefs));
		sb.append(renderNavigationEntry("Screenshots", screenshots_hrefs));
		sb.append(renderNavigationEntry("Team", team_hrefs));
		sb.append(renderNavigationEntry("Kontakt", contact_hrefs));
		sb.append(renderNavigationEntry("Web-App", webapp_hrefs));

		return sb.toString();
	}

	public static String renderSubNavigation() {
		StringBuilder sb = new StringBuilder();

		List<String> boatinfo_hrefs = new LinkedList<String>();
		boatinfo_hrefs.add("boat_info");

		List<String> triplist_hrefs = new LinkedList<String>();
		triplist_hrefs.add("trip_list");

		List<String> tripinfo_hrefs = new LinkedList<String>();
		tripinfo_hrefs.add("trip_info.php");

		List<String> logentry_hrefs = new LinkedList<String>();
		logentry_hrefs.add("log_entry.php");

		List<String> seamap_hrefs = new LinkedList<String>();
		seamap_hrefs.add("seamap.php");

		sb.append(renderNavigationEntry("Boat Info", boatinfo_hrefs));
		sb.append(renderNavigationEntry("Trip List", triplist_hrefs));
		sb.append(renderNavigationEntry("Trip Info", tripinfo_hrefs));
		sb.append(renderNavigationEntry("Log Entry", logentry_hrefs));
		sb.append(renderNavigationEntry("Seamap", seamap_hrefs));

		return sb.toString();
	}

	public static String renderNavigationEntry(String title, List<String> hrefs) {
		String htmlclass = "";
		if (hrefs.contains(filename)) {
			htmlclass = "active";
		}

		return renderLink(htmlclass, hrefs.get(0), title);
	}

	public static String renderLink(String htmlclass, String href, String title) {
		return "<li class=\"" + htmlclass + "\"><a href=\"" + href + "\">" + title + "</a></li>";
	}

	public static boolean hasSubNavigation() {
		List<String> subnavi_files = new LinkedList<String>();
		subnavi_files.add("boat_info.php");
		subnavi_files.add("log_entry.php");
		subnavi_files.add("trip_info.php");
		subnavi_files.add("seamap.php");
		subnavi_files.add("trip_list.php");

		return subnavi_files.contains(filename);
	}
}