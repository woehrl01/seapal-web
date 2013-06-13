package de.htwg.seapal.web.controllers;

import java.util.Map;
import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;

import de.htwg.seapal.controller.IBoatController;
import de.htwg.seapal.model.IBoat;
import de.htwg.seapal.model.impl.Boat;
import de.htwg.seapal.utils.logging.ILogger;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BoatAPI extends Controller {

	static Form<Boat> form = Form.form(Boat.class);
	
	@Inject
	private IBoatController controller;
	
	@Inject
	private ILogger logger;

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
		logger.info("BoatAPI", "--> addBoat");
		Form<Boat> filledForm = form.bindFromRequest();
		Map<String, String> data = form.data();
		logger.info("Filled Form Data" , filledForm.toString());
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			logger.warn("BoatAPI", "FilledForm has errors: " + filledForm.errorsAsJson().toString());
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			boolean created = controller.saveBoat(filledForm.get());
			if(created) {
				logger.info("BoatAPI", "Boat created");
				return created(response);
			} else {
				logger.info("BoatAPI", "Boat updated");
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