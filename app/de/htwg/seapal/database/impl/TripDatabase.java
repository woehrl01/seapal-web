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


public class TripDatabase extends CouchDbRepositorySupport<Trip> implements ITripDatabase {

	private final ILogger logger;
	
	@Inject
	protected TripDatabase(@Named("tripCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Trip.class, db, true);
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
		Trip entity = (Trip)data;
		
		if (entity.isNew()) {
			// ensure that the id is generated and revision is null for saving a new entity
			entity.setId(UUID.randomUUID().toString());
			entity.setRevision(null);
			add(entity);
			return true;
		}
		
		logger.info("TripDatabase", "Updating entity with UUID: " + entity.getId());
		update(entity);
		return false;
	}

	@Override
	public ITrip get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<ITrip> loadAll() {
		List<ITrip> trips = new LinkedList<ITrip>(getAll());
		logger.info("TripDatabase", "Loaded entities. Count: " + trips.size());
		return trips;
	}

	@Override
	public void delete(UUID id) {
		logger.info("TripDatabase", "Removing entity with UUID: " + id.toString());
		remove((Trip)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
