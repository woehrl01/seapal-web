package controllers.helpers;

import java.util.List;

import models.Menu;

import play.mvc.Result;
import play.mvc.Action;
import play.mvc.Http;

public class Menus extends Action.Simple {

	public Result call(Http.Context ctx) throws Throwable {
        ctx.args.put("mainNavi", Menu.createMainNavi(ctx.request().uri()));
        ctx.args.put("subNavi", Menu.createSubNavi(ctx.request().uri()));
        return delegate.call(ctx);
    }
	
	public static List<Menu> mainNavigation() {
        return (List<Menu>)Http.Context.current().args.get("mainNavi");
    }
	
	public static List<Menu> subNavigation() {
        return (List<Menu>)Http.Context.current().args.get("subNavi");
    }
	
	public static boolean hasSubNavigation(){
		List<Menu> menu = (List<Menu>)Http.Context.current().args.get("subNavi");
		
		return (menu != null && !menu.isEmpty());
	}

}