package controllers;

import controllers.helpers.Menus;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;
import views.html.content.*;

@With(Menus.class)
public class Application extends Controller {
	
	public static Result index() {
		return ok(index.render());
	}

	public static Result screenshots() {
		return ok(screenshots.render());
	}

	public static Result about() {
		return ok(about.render());
	}

	public static Result contact() {
		return ok(contact.render());
	}

	public static Result user_guide() {
		return ok(user_guide.render());
	}
	
}