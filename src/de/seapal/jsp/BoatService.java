package de.seapal.jsp;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class TestServlet
 */
@WebServlet("/BoatService")
public class BoatService extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private final Map<String, Map<String, String>> boats = new HashMap<String, Map<String, String>>();

	public BoatService() {
		for (int i = 0; i < 10; i++) {
			Map<String, String> boat = new HashMap<String, String>();
			int id = boats.size();
			boats.put(++id + "", boat);
			boat.put("id", id + "");
			boat.put("boat_name", "titanic " + id);
			boat.put("register_nr", "reg " + id);
			boat.put("boat_type", "bt " + id);
			boat.put("build_year", (1920 + id) + "");
		}
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		PrintWriter writer = response.getWriter();
		if (request.getParameter("id") != null) {
			writer.println(new JSONObject(boats.get(request.getParameter("id"))));
		} else {
			JSONArray array = new JSONArray();
			for (Map.Entry<String, Map<String, String>> x : boats.entrySet()) {
				array.put(x.getValue());
			}
			writer.println(array);
		}

		writer.close();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String, String[]> params = request.getParameterMap();

		System.out.println(params.get("method"));

		if (params.get("method")[0].equals("delete")) {
			boats.remove(params.get("id")[0]);
		} else {

			if (params.get("id")[0].equals("-1")) {
				int id = boats.size();
				addBoat(++id + "", params);
			} else {
				boats.remove(params.get("id")[0]);
				addBoat(params.get("id")[0], params);
			}
		}

		PrintWriter writer = response.getWriter();
		writer.println("{\"success\":\"true\"}");
		writer.close();
	}

	private void addBoat(String id, Map<String, String[]> params) {
		Map<String, String> boat = new HashMap<String, String>();
		boats.put(id, boat);

		for (Map.Entry<String, String[]> x : params.entrySet()) {
			if (x.getKey().equals("id")) {
				boat.put("id", id);
			} else {
				boat.put(x.getKey(), x.getValue()[0]);
			}
		}
	}

}
