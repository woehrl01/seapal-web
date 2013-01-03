package controllers;

import java.util.concurrent.Callable;

import models.BoatPosition;

import static play.libs.Akka.future;
import play.libs.F.*;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BoatPositionAPI extends Controller {
	
	private static BoatPosition position = new BoatPosition(47.655, 9.21006);
	
	public static Result current() {
		
		return async(
			    future(new Callable<BoatPosition>() {
			      public BoatPosition call() {
			    	position.move();
					return position;
			      }   
			    }).map(new Function<BoatPosition, Result>() {
					public Result apply(BoatPosition position){
						return ok(Json.toJson(position));
					}
			    })
			  );

	}
}
