package de.htwg.seapal.web.controllers;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.google.inject.Inject;

import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.utils.logging.ILogger;
import de.htwg.seapal.web.controllers.Application.TripList;

public class RegattaAPI extends Controller {

	@Inject
	private ILogger logger;

	@Inject 
	private ITripController tripController;
	
	@Inject
	private IWaypointController waypointController;
	
	public Result send_to_SAP() {
		Form<TripList> form = Form.form(TripList.class);
		return ok(form.bindFromRequest().get().toUUID().toString());
	}

	public Result allTripsAsJson() {
		return ok(Json.toJson(tripController.getAllTrips()));
	}
}
