package de.htwg.seapal.web.controllers;

import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;

import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.model.IBoat;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class TripAPI extends Controller {

	static Form<Trip> form = Form.form(Trip.class);
	
	@Inject
	private ITripController controller;
	
	public Result tripsAsJson(UUID boatId) {
		return ok(Json.toJson(controller.getAllTrips(boatId)));
	}
	
	public Result tripAsJson(UUID id) {
		ITrip boat = controller.getTrip(id);
		if(boat != null){
			return ok(Json.toJson(boat));
		}else{
			return notFound();
		}
	}
	
	public Result alltripsAsJson() {
		return ok(Json.toJson(controller.getAllTrips()));
	}

	public Result addTrip() {
		Form<Trip> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			boolean created = controller.saveTrip(filledForm.get());
			if(created){
				return created(response);
			}else{
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