package de.htwg.seapal.web.controllers;

import java.util.List;
import java.util.UUID;

import org.codehaus.jackson.node.ObjectNode;

import com.google.inject.Inject;

import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;
import de.htwg.seapal.utils.logging.ILogger;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class RegattaAPI extends Controller {
	
	@Inject
	private ITripController controller;
	
	@Inject
	private ILogger logger;
	
	public Result allTripsAsJson() {
		return ok(Json.toJson(controller.getAllTrips()));
	}
}