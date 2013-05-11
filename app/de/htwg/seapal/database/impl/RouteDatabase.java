package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IRouteDatabase;
import de.htwg.seapal.model.IRoute;
import de.htwg.seapal.model.impl.Route;
import de.htwg.seapal.utils.logging.ILogger;

public class RouteDatabase extends CouchDbRepositorySupport<Route> implements
		IRouteDatabase {

	private final ILogger logger;
	
	@Inject
	protected RouteDatabase(@Named("routeCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Route.class, db);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("RouteDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IRoute data) {
		add((Route) data);

		return false;
	}

	@Override
	public IRoute get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IRoute> loadAll() {
		return new LinkedList<IRoute>(getAll());
	}

	@Override
	public void delete(UUID id) {
		remove((Route)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
