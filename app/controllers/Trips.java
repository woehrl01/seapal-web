package controllers;

import org.codehaus.jackson.node.ObjectNode;

import controllers.helpers.Menus;

import models.Boat;
import models.Trip;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;
import views.html.content.*;

public class Trips extends Controller {

	static Form<Boat> form = form(Boat.class);
	
	@With(Menus.class)
	public static Result listByBoatId(Long boatId) {
		return ok(trip_list.render(boatId));
	}
	
	@With(Menus.class)
	public static Result listAll() {
		return ok(trip_list.render(new Long(-1)));
	}
	
	public static Result tripsAsJson(Long boatId) {
		return ok(Json.toJson(Trip.find.where().eq("boat_id", boatId)).toString());
	}

	public static Result addBoat() {
		Form<Boat> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			if(Integer.parseInt(filledForm.field("id").value()) > 0){
				Boat.update(filledForm.get());

				return ok(response);
			}else{
				Boat.create(filledForm.get());

				return created(response);
			}
		}
	}

	public static Result deleteTrip(Long id) {
		Trip.delete(id);
		ObjectNode response = Json.newObject();
		response.put("success", true);
		
		return ok(response);
	}

}