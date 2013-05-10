package de.htwg.seapal.web.controllers;

import java.util.concurrent.Callable;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.JsonNodeFactory;
import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.changes.ChangesCommand;
import org.ektorp.changes.ChangesFeed;
import org.ektorp.changes.DocumentChange;

import com.google.inject.Inject;

import static play.libs.Akka.future;
import play.libs.F.*;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

public class BoatPositionAPI extends Controller {
	
	@Inject
	private CouchDbInstance dbInstance;
	
	public Result current() {
		
		return async(
			    future(new Callable<JsonNode>() {
			      public JsonNode call() {
			    	  
					CouchDbConnector db = dbInstance.createConnector("positions", true);

					ChangesCommand cmd = new ChangesCommand.Builder().includeDocs(true).build();

					ChangesFeed feed = db.changesFeed(cmd);
					try {
						while (feed.isAlive()) {
							DocumentChange change = feed.next();
							return change.getDocAsNode();
						}
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
			    	
					return JsonNodeFactory.instance.textNode("error in fetching changes");
			      }   
			    }).map(new Function<JsonNode, Result>() {
					public Result apply(JsonNode position){
						return ok(position);
					}
			    })
			  );

	}
}
