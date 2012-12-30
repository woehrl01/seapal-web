package de.seapal.gwt.server;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import de.seapal.gwt.client.BoatService;

/**
 * The server side implementation of the RPC service.
 */
public class BoatServiceImpl extends RemoteServiceServlet implements
		BoatService {

	private static final long serialVersionUID = 1L;

	private final Map<String, Map<String, String>> boats = new HashMap<String, Map<String, String>>();

	public String saveBoat(String name, String registernr, String typ,
			String baujahr) throws IllegalArgumentException {
		if (!name.equals("")) {
			int id = boats.size();
			addBoat(++id + "", name, registernr, typ, baujahr);
		}

		StringBuilder writer = new StringBuilder();

		JSONArray array = new JSONArray();
		for (Map.Entry<String, Map<String, String>> x : boats.entrySet()) {
			array.put(x.getValue());
		}
		writer.append(array);

		return writer.toString();
	}

	private void addBoat(String id, String name, String registernr, String typ,
			String baujahr) {
		Map<String, String> boat = new HashMap<String, String>();
		boats.put(id, boat);

		boat.put("id", id + "");
		boat.put("name", name + "");
		boat.put("registernr", registernr + "");
		boat.put("typ", typ + "");
		boat.put("baujahr", baujahr + "");
	}
}
