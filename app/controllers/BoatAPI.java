package controllers;

import org.codehaus.jackson.node.ObjectNode;

import models.Boat;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BoatAPI extends Controller {

	static Form<Boat> form = form(Boat.class);

	public static Result boatsAsJson() {
		return ok(Json.toJson(Boat.all()));
	}
	
	public static Result boatAsJson(Long id) {
		return ok(Json.toJson(Boat.findById(id)));
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
		ObjectNode response = Json.newObject();
		response.put("success", true);
		
		return ok(response);
	}

}