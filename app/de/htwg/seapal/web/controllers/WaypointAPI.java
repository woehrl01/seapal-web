package de.htwg.seapal.web.controllers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;

import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.model.IWaypoint;
import de.htwg.seapal.model.IRace.RaceWaypoint;
import de.htwg.seapal.model.impl.Waypoint;
import de.htwg.seapal.utils.logging.ILogger;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class WaypointAPI extends Controller {

	static Form<Waypoint> form = Form.form(Waypoint.class);
	
	@Inject
	private IWaypointController controller;
	
	@Inject
	private ILogger logger;
	
	public Result waypointAsJson(UUID waypointId) {
		IWaypoint waypoint = controller.getWaypoint(waypointId);
		return ok(Json.toJson(waypoint));
	}
	
	public Result waypointsAsJson(UUID tripId) {
		List<IWaypoint> waypoints = controller.getAllWaypoints(tripId);
		
		Collections.sort(waypoints, new Comparator<IWaypoint>(){

	            @Override
	            public int compare(IWaypoint arg0, IWaypoint arg1) {
	                return arg0.getDate().compareTo(arg1.getDate());
	            }
	            
	        });
	      
		
		return ok(Json.toJson(waypoints));
	}

	public Result addWaypoint() {
		logger.info("WaypointAPI", "--> addWaypoint");
		Form<Waypoint> filledForm = form.bindFromRequest();
		Map<String, String> data = form.data();
		logger.info("Filled Form Data" , filledForm.toString());
		
		ObjectNode response = Json.newObject();
		
		if (filledForm.hasErrors()) {
			logger.warn("WaypointAPI", "FilledForm has errors: " + filledForm.errorsAsJson().toString());
			response.put("success", false);
			response.put("errors", filledForm.errorsAsJson());
			
			return badRequest(response);
		} else {
			response.put("success", true);
			controller.saveWaypoint(filledForm.get());

			logger.info("WaypointAPI", "Waypoint created");
			return created(response);
		}
	}

}