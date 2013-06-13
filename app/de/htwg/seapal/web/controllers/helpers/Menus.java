package de.htwg.seapal.web.controllers.helpers;

import java.util.LinkedList;
import java.util.List;

import de.htwg.seapal.web.models.MenuItem;


import play.mvc.Result;
import play.mvc.Action;
import play.mvc.Http;

public class Menus extends Action.Simple {

	public Result call(Http.Context ctx) throws Throwable {
        ctx.args.put("mainNavi", createMainNavi(ctx.request().uri()));
        ctx.args.put("subNavi", createSubNavi(ctx.request().uri()));
        return delegate.call(ctx);
    }

	public static List<MenuItem> createMainNavi(String url){
		List<MenuItem> menu = new LinkedList<MenuItem>();
		
		menu.add(new MenuItem("Start", "/"));
		menu.add(new MenuItem("How To", "/user_guide"));
		menu.add(new MenuItem("Screenshots", "/screenshots"));
		menu.add(new MenuItem("Team", "/about"));
		menu.add(new MenuItem("Kontakt", "/contact"));
		//menu.add(new MenuItem("Logbook", "/boat_info"));
		
		return menu;
		
	}
	
	public static List<MenuItem> createSubNavi(String url){
		List<MenuItem> menu = new LinkedList<MenuItem>();
		
		menu.add(new MenuItem("Boat Info", "/boat_info"));
		//menu.add(new MenuItem("Trip List", "/trips"));
		//menu.add(new MenuItem("Trip Info", "/trip/1"));
		//menu.add(new MenuItem("Log Entry", "/trip/1/waypoint"));
		menu.add(new MenuItem("Trip List", ""));
		menu.add(new MenuItem("Trip Info", ""));
		menu.add(new MenuItem("Log Entry", ""));
		//menu.add(new MenuItem("Seamap", "/seamap"));
		
		if(menu.contains(new MenuItem(url)) || url.contains("/boat")){
			return menu;
		} else {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public static List<MenuItem> mainNavigation() {
        
		return (List<MenuItem>)Http.Context.current().args.get("mainNavi");
    }
	
	@SuppressWarnings("unchecked")
	public static List<MenuItem> subNavigation() {
        return (List<MenuItem>)Http.Context.current().args.get("subNavi");
    }
	
	public static boolean hasSubNavigation(){
		List<MenuItem> menu = subNavigation();
		
		return (menu != null && !menu.isEmpty());
	}

}