package controllers;

import org.codehaus.jackson.node.ObjectNode;

import models.Waypoint;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class WaypointAPI extends Controller {

	static Form<Waypoint> form = form(Waypoint.class);
	
	public static Result waypointsAsJson(Long tripId) {
		return ok(Json.toJson(Waypoint.find.where().eq("trip_id", tripId).findList()).toString());
	}

	public static Result addWaypoint() {
		Form<Waypoint> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			Waypoint.create(filledForm.get());

			return created(response);
		}
	}

}