package controllers;

import org.codehaus.jackson.node.ObjectNode;

import controllers.helpers.Menus;

import models.Boat;
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
	
	
/*
	public static Result boatsAsJson() {
		return ok(Json.toJson(Boat.all()).toString());
	}
	
	public static Result boatAsJson(Long id) {
		return ok(Json.toJson(Boat.findById(id)).toString());
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

	public static Result deleteBoat(Long id) {
		Boat.delete(id);
		return redirect(routes.BoatInfo.index());
	}
	*/

}