package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.about;
import views.html.contact;
import views.html.index;
import views.html.screenshots;
import views.html.user_guide;

public class Application extends Controller {

	public static Result index() {
		return ok(index.render("SeaPal - Track your searoutes easily"));
	}

	public static Result screenshots() {
		return ok(screenshots.render("SeaPal - Screenshots"));
	}

	public static Result about() {
		return ok(about.render("SeaPal - Team"));
	}

	public static Result contact() {
		return ok(contact.render()); // FIXME: why does the message-parameter
										// not work here!?!??
	}

	public static Result user_guide() {
		return ok(user_guide.render("SeaPal - How To"));
	}

}