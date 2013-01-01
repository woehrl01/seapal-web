package controllers;

import models.Boat;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.content.*;

public class BoatInfoController extends Controller {

	static Form<Boat> form = form(Boat.class);

	public static Result index() {
		return ok(boat_info.render("Boat Info", Boat.all(), form));
	}

	public static Result boatsAsJson() {
		return ok(Json.toJson(Boat.all()).toString());
	}

	public static Result addBoat() {
		Form<Boat> filledForm = form.bindFromRequest();

		if (filledForm.hasErrors()) {
			return badRequest(boat_info.render("Boat Info", Boat.all(), filledForm));
		} else {
			Boat.create(filledForm.get());
			return redirect(routes.Boat_Info.index());
		}
	}

	public static Result deleteBoat(Long id) {
		Boat.delete(id);
		return redirect(routes.Boat_Info.index());
	}

}