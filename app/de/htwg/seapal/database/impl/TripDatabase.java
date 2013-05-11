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
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;

public class TripDatabase extends CouchDbRepositorySupport<Trip> implements
		ITripDatabase {

	private final Logger logger;
	
	@Inject
	protected TripDatabase(@Named("tripCouchDbConnector") CouchDbConnector db, Logger logger) {
		super(Trip.class, db);
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
	public boolean save(ITrip data) {
		add((Trip) data);

		return false;
	}

	@Override
	public ITrip get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<ITrip> loadAll() {
		return new LinkedList<ITrip>(getAll());
	}

	@Override
	public void delete(UUID id) {
		remove((Trip)get(id));
	}

	@Override
	public boolean close() {
		return false;
	}

}
