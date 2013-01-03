package controllers;

import org.codehaus.jackson.node.ObjectNode;

import models.MediaType;
import models.Trip;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class TripAPI extends Controller {

	static Form<Trip> form = form(Trip.class);
	
	public static Result tripsAsJson(Long boatId) {
		return ok(Json.toJson(Trip.find.where().eq("boat_id", boatId).findList()).toString()).as(MediaType.JSON);
	}
	
	public static Result tripAsJson(Long id) {
		return ok(Json.toJson(Trip.findById(id)).toString()).as(MediaType.JSON);
	}
	
	public static Result alltripsAsJson() {
		return ok(Json.toJson(Trip.find.all()).toString()).as(MediaType.JSON);
	}

	public static Result addTrip() {
		Form<Trip> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			if(Integer.parseInt(filledForm.field("id").value()) > 0){
				Trip.update(filledForm.get());

				return ok(response);
			}else{
				Trip.create(filledForm.get());

				return created(response).as(MediaType.JSON);
			}
		}
	}
	
	public static Result deleteTrip(Long id) {
		Trip.delete(id);
		ObjectNode response = Json.newObject();
		response.put("success", true);
		
		return ok(response).as(MediaType.JSON);
	}

}