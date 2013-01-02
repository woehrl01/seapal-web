package models;

import java.util.LinkedList;
import java.util.List;

public class Menu {
	public String name;
	public String url;
	
	public Menu(String name, String url){
		this.name = name;
		this.url = url;
	}
	
	public static List<Menu> createMainNavi(String url){
		List<Menu> menus = new LinkedList<Menu>();
		
		menus.add(new Menu("Start", "/"));
		menus.add(new Menu("How To", "/user_guide"));
		menus.add(new Menu("Screenshots", "/screenshots"));
		menus.add(new Menu("Team", "/about"));
		menus.add(new Menu("Kontakt", "/contact"));
		menus.add(new Menu("Web-App", "/boat_info"));
		
		return menus;
		
	}
	
	public static List<Menu> createSubNavi(String url){
		List<Menu> menus = new LinkedList<Menu>();
		
		menus.add(new Menu("Boat Info", "/boat_info"));
		menus.add(new Menu("Trip List", "/trip_list"));
		menus.add(new Menu("Trip Info", "/trip_info"));
		menus.add(new Menu("Log Entry", "/log_entry"));
		menus.add(new Menu("Seamap", "/seamap"));
		
		for(Menu menu : menus){
			if(url.contains(menu.url))
				return menus;
		}
		
		return null;
	}
}
