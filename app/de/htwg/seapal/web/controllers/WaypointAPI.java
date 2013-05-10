package de.htwg.seapal.web.controllers;

import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;

import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.model.IWaypoint;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class WaypointAPI extends Controller {

	static Form<IWaypoint> form = Form.form(IWaypoint.class);
	
	@Inject
	private IWaypointController controller;
	
	public Result waypointsAsJson(UUID tripId) {
		return ok(Json.toJson(controller.getAllWaypoints(tripId)));
	}

	public Result addWaypoint() {
		Form<IWaypoint> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			controller.saveWaypoint(filledForm.get());

			return created(response);
		}
	}

}