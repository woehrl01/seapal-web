package de.htwg.seapal.web.controllers;

import java.util.List;
import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.google.inject.Inject;

import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;
import de.htwg.seapal.utils.logging.ILogger;

public class TripAPI extends Controller {

	static Form<Trip> form = Form.form(Trip.class);
	
	@Inject
	private ITripController controller;
	
	@Inject
	private ILogger logger;
	
	public Result tripsAsJson(UUID boatId) {
		List<ITrip> tripsOfBoat = controller.getAllTrips(boatId);
		return ok(Json.toJson(tripsOfBoat));
	}
	
	public Result tripAsJson(UUID id) {
		ITrip boat = controller.getTrip(id);
		if(boat != null){
			return ok(Json.toJson(boat));
		}else{
			return notFound();
		}
	}
	
	public Result allTripsAsJson() {
		return ok(Json.toJson(controller.getAllTrips()));
	}

	public Result addTrip() {
		logger.info("TripAPI", "--> addTrip");
		Form<Trip> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			logger.warn("TripAPI", "FilledForm has errors: " + filledForm.errorsAsJson().toString());
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			boolean created = controller.saveTrip(filledForm.get());
			if(created) {
				logger.info("TripAPI", "Trip created");
				return created(response);
			}else{
				logger.info("TripAPI", "Trip updated");
				return ok(response);
			}
		}
	}
	
	public Result deleteTrip(UUID id) {
		controller.deleteTrip(id);
		ObjectNode response = Json.newObject();
		response.put("success", true);
		
		return ok(response);
	}

}