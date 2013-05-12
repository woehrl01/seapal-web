package de.htwg.seapal.web.controllers;

import java.util.UUID;

import org.codehaus.jackson.JsonNode;

import de.htwg.seapal.web.models.WaypointWebsocket;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.WebSocket;

public class SocketController extends Controller {
	
	public static WebSocket<JsonNode> open() {
		return new WebSocket<JsonNode>() {
			@Override
			public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
				
				try {
					WaypointWebsocket.register(UUID.randomUUID().toString(), in, out);

				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		};
	}
}
