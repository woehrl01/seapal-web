package de.htwg.seapal.web.controllers;

import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.controller.IBoatController;
import de.htwg.seapal.model.IBoat;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BoatAPI extends Controller {

	static Form<IBoat> form = Form.form(IBoat.class);
	
	@Inject
	private IBoatController controller;

	public Result boatsAsJson() {
		return ok(Json.toJson(controller.getAllBoats()));
	}
	
	public Result boatAsJson(UUID id) {
		IBoat boat = controller.getBoat(id);
		if(boat != null){
			return ok(Json.toJson(boat));
		}else{
			return notFound();
		}
	}

	public Result addBoat() {
		Form<IBoat> filledForm = form.bindFromRequest();
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			boolean created = controller.saveBoat(filledForm.get());
			if(created){
				return created(response);
			}else{
				return ok(response);
			}
		}
	}

	public Result deleteBoat(UUID id) {
		controller.deleteBoat(id);
		ObjectNode response = Json.newObject();
		response.put("success", true);
		
		return ok(response);
	}

}