package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.IWaypoint;
import de.htwg.seapal.model.impl.Trip;
import de.htwg.seapal.model.impl.Waypoint;

public class WaypointDatabase extends CouchDbRepositorySupport<Waypoint> implements
		IWaypointDatabase {

	private final Logger logger;
	
	@Inject
	protected WaypointDatabase(@Named("waypointCouchDbConnector") CouchDbConnector db, Logger logger) {
		super(Waypoint.class, db);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		return false;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IWaypoint data) {
		add((Waypoint) data);

		return false;
	}

	@Override
	public Waypoint get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IWaypoint> loadAll() {
		return new LinkedList<IWaypoint>(getAll());
	}

	@Override
	public void delete(UUID id) {
		remove(get(id));
	}

	@Override
	public boolean close() {
		return false;
	}

}
