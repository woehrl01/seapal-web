package controllers.helpers;

import play.*;
import play.mvc.*;
import java.util.List;
import java.util.LinkedList;

public class HeaderHelper {

	public static String filename = ""; //Http.Request.current().url; ???

	public static String renderNavigation() {
		StringBuilder sb = new StringBuilder();

		List<String> start_hrefs = new LinkedList<String>();
		start_hrefs.add("index.php");
		start_hrefs.add("");

		List<String> howto_hrefs = new LinkedList<String>();
		howto_hrefs.add("user_guide.php");

		List<String> screenshots_hrefs = new LinkedList<String>();
		screenshots_hrefs.add("user_guide.php");

		List<String> team_hrefs = new LinkedList<String>();
		team_hrefs.add("about.php");

		List<String> contact_hrefs = new LinkedList<String>();
		contact_hrefs.add("contact.php");

		List<String> webapp_hrefs = new LinkedList<String>();
		webapp_hrefs.add("boat_info.php");
		webapp_hrefs.add("log_entry.php");
		webapp_hrefs.add("trip_info.php");
		webapp_hrefs.add("seamap.php");

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
		boatinfo_hrefs.add("boat_info.php");

		List<String> triplist_hrefs = new LinkedList<String>();
		triplist_hrefs.add("trip_list.php");

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

/*
$filename = basename($_SERVER['SCRIPT_FILENAME']);

function print_nav_element($name, $href) {
	global $filename;
	
	$class = "";
	$hrefs = array_slice(func_get_args(), 1);
	
	if(contains($filename, $hrefs)){
		$class = "active";	
	}

	echo '<li class="'.$class.'"><a href="'.$href.'">'.$name.'</a></li>';
}

function contains($filename, $name){
	if(is_array($name)) {
		$names = $name;
	} else {
		$names = array_slice(func_get_args(), 1);
	}
	
	foreach($names as $name){		
		if($filename === $name){
			return true;
		}
	}
	
	return false;
}
// Navi
<?php print_nav_element( "Start", "index.php", "" ); ?>
						<?php print_nav_element( "How To", "user_guide.php" ); ?>
						<?php print_nav_element( "Screenshots", "screenshots.php" ); ?>
						<?php print_nav_element( "Team", "about.php" ); ?>
						<?php print_nav_element( "Kontakt", "contact.php" ); ?>
						<?php print_nav_element( "Web-App", "boat_info.php", "boat_info.php", "log_entry.php", "trip_info.php", "seamap.php" ); ?>

// Subnavi
<?php print_nav_element( "Boat Info", "boat_info.php" ); ?>
						<?php print_nav_element( "Trip List", "trip_list.php" ); ?>
						<?php print_nav_element( "Trip Info", "trip_info.php" ); ?>
						<?php print_nav_element( "Log Entry", "log_entry.php" ); ?>
						<?php print_nav_element( "Seamap", "seamap.php" ); ?>

*/