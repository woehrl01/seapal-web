package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;
import de.htwg.seapal.utils.logging.ILogger;

public class TripDatabase extends CouchDbRepositorySupport<Trip> implements
		ITripDatabase {

	private final ILogger logger;
	
	@Inject
	protected TripDatabase(@Named("tripCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Trip.class, db);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("TripDatabase", "Database connection opened");
		return true;
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
		return true;
	}

}
