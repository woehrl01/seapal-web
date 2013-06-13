package de.htwg.seapal.web.controllers;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import com.google.common.collect.ImmutableList;
import com.google.inject.Inject;

import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Waypoint;
import de.htwg.seapal.utils.logging.ILogger;
import de.htwg.seapal.web.controllers.helpers.Menus;
import de.htwg.seapal.web.views.html.content.*;
import play.Logger;
import play.Routes;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;

@With(Menus.class)
public class Application extends Controller {
	
	@Inject
	private ITripController tripController;
	
	@Inject
	private IWaypointController waypointController;
	
	@Inject
	private ILogger logger;
	
	public static Result index() {
		return ok(index.render());
	}

	public static Result screenshots() {
		return ok(screenshots.render());
	}

	public static Result about() {
		return ok(about.render());
	}

	public static Result contact() {
		return ok(contact.render());
	}

	public static Result user_guide() {
		return ok(user_guide.render());
	}
	
	public static Result seamap(){
		return ok(seamap.render());
	}
	
	public static Result boat_info() {
		return ok(boat_info.render());
	}
	
	public static Result trip_list(UUID boatId) {
		return ok(trip_list.render(boatId));
	}
	
	public static Result trip_add(UUID boatId) {
		return ok(trip_info.render(boatId, null));
	}
	
	public static Result trip_edit(UUID tripId) {
		return ok(trip_info.render(null, tripId));
	}
	
	public static Result waypoint_add(UUID tripId){
		Form<Waypoint> form = Form.form(Waypoint.class);
		return ok(log_entry.render(tripId, null, form));
	}
	
	public Result waypoint_show(UUID waypointId) {
		Form<Waypoint> form = Form.form(Waypoint.class);
		return ok(log_entry.render(null, waypointId, form.fill((Waypoint)waypointController.getWaypoint(waypointId))));
	}
	
	public static class TripList {
		public List<String> tripId = new LinkedList<String>();
		
		public List<UUID> toUUID() {
			List<UUID> list = new ArrayList<UUID>(tripId.size());
			
			for (String id : tripId) {
				list.add(UUID.fromString(id));
			}
			return list;
		}
	}
	
	public Result regatta_add() {
		Form<TripList> form = Form.form(TripList.class);
		logger.info("Application1", form.bindFromRequest().get().tripId.toString());
		logger.info("Application2", form.bindFromRequest().get().toUUID().toString());
		return ok(regatta.render(form.bindFromRequest().get().toUUID()));
	}
	
	public Result regatta_view(){
		return ok(regatta.render(tripController.getTrips()));
	}
	
	public static Result javascriptRoutes() {
	    response().setContentType("text/javascript");
	    return ok(
	      Routes.javascriptRouter("jsRoutes",
	        // Routes
	    	// Application
    		de.htwg.seapal.web.controllers.routes.javascript.Application.trip_list(),
  	        de.htwg.seapal.web.controllers.routes.javascript.Application.trip_edit(),
  	        de.htwg.seapal.web.controllers.routes.javascript.Application.waypoint_show(),
	    	// API  
	        de.htwg.seapal.web.controllers.routes.javascript.BoatAPI.boatAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.BoatAPI.boatsAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.BoatAPI.deleteBoat(),
	        de.htwg.seapal.web.controllers.routes.javascript.BoatAPI.addBoat(),
	        de.htwg.seapal.web.controllers.routes.javascript.TripAPI.tripsAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.TripAPI.tripAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.TripAPI.alltripsAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.TripAPI.addTrip(),
	        de.htwg.seapal.web.controllers.routes.javascript.WaypointAPI.addWaypoint(),
	        de.htwg.seapal.web.controllers.routes.javascript.WaypointAPI.waypointAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.WaypointAPI.waypointsAsJson(),
	        de.htwg.seapal.web.controllers.routes.javascript.BoatPositionAPI.current(),
	        de.htwg.seapal.web.controllers.routes.javascript.RegattaAPI.allTripsAsJson()
	      )
	    );
	  }
}