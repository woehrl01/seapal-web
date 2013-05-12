package de.htwg.seapal.web.models;

import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.libs.Akka;
import play.libs.F.Callback;
import play.libs.F.Callback0;
import play.mvc.WebSocket;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;

/**
 * Management Class of WebSockets.
 * 
 * @see http://playlatam.wordpress.com/tag/websockets/
 * 
 * @author Julian Mueller
 *
 */
public class WaypointWebsocket extends UntypedActor {

	public static final ActorRef actor = Akka.system().actorOf(
			new Props(WaypointWebsocket.class));

	private final Map<String, WebSocket.Out<JsonNode>> registreredWebsockets = new HashMap<String, WebSocket.Out<JsonNode>>();

	public static void sendJsonObjectToClient(JsonNode message) {
		actor.tell(message, actor);
	}

	public static void register(final String id, final WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out)
			throws Exception {

		actor.tell(new RegistrationMessage(id, out), actor);

		// For each event received on the socket,
		in.onMessage(new Callback<JsonNode>() {
			@Override
			public void invoke(JsonNode event) {
				// nothing to do
			}
		});

		// When the socket is closed.
		in.onClose(new Callback0() {
			@Override
			public void invoke() {
				actor.tell(new UnregistrationMessage(id), actor);
			}
		});
	}

	@Override
	public void onReceive(Object message) throws Exception {
		if (message instanceof RegistrationMessage) {
			RegistrationMessage registration = (RegistrationMessage) message;

			Logger.info("Registering " + registration.id + "...");
			registreredWebsockets.put(registration.id, registration.channel);

		} else if (message instanceof ObjectNode) {
			ObjectNode messageToSend = (ObjectNode) message;

			for (WebSocket.Out<JsonNode> channel : registreredWebsockets.values()) {
				channel.write(messageToSend);
			}

		} else if (message instanceof UnregistrationMessage) {
			UnregistrationMessage quit = (UnregistrationMessage) message;

			Logger.info("Unregistering " + quit.id + "...");
			registreredWebsockets.remove(quit.id);

		} else {
			unhandled(message);
		}
	}

	public static class RegistrationMessage {
		public String id;
		public WebSocket.Out<JsonNode> channel;

		public RegistrationMessage(String id, WebSocket.Out<JsonNode> channel) {
			super();
			this.id = id;
			this.channel = channel;
		}
	}

	public static class UnregistrationMessage {
		public String id;

		public UnregistrationMessage(String id) {
			super();
			this.id = id;
		}
	}

}
