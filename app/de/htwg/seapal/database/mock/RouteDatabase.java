package de.htwg.seapal.database.mock;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import de.htwg.seapal.database.IRouteDatabase;
import de.htwg.seapal.model.IRoute;
import de.htwg.seapal.model.impl.Route;

public class RouteDatabase implements IRouteDatabase {
	Map<UUID, IRoute> db = new HashMap<UUID, IRoute>();
	private IRoute newRoute;

	public RouteDatabase() {
		open();
	}
	
	@Override
	public boolean open() {
		// create test data
		UUID id = createNewRouteInDatabase();
		newRoute = get(id);
		newRoute.setName("Route-NEW");
		save(newRoute);
		for (int i = 1; i < 10; i++) {
			id = createNewRouteInDatabase();
			IRoute waypoint = get(id);
			waypoint.setName("Route-" + i);
			save(waypoint);
		}
		return true;
	}
	
	@Override
	public boolean close() {
		return true;
	}

	@Override
	public UUID create() {
		return newRoute.getUUID();
	}

	private UUID createNewRouteInDatabase() {
		IRoute route = new Route();
		UUID id = route.getUUID();
		db.put(id, route);
		return id;
	}

	@Override
	public void save(IRoute route) {
		db.put(route.getUUID(), route);
	}

	@Override
	public void delete(UUID id) {
		if (db.containsKey(id)) {
			db.remove(id);
		}
	}

	@Override
	public IRoute get(UUID id) {
		return new Route(db.get(id));
	}

	@Override
	public List<IRoute> getAll() {
		Collection<IRoute> collection = db.values();
		List<IRoute> values = new ArrayList<IRoute>(collection);
		return values;
	}
}
