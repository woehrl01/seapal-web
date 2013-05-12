package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IBoatDatabase;
import de.htwg.seapal.model.IBoat;
import de.htwg.seapal.model.impl.Boat;
import de.htwg.seapal.utils.logging.ILogger;

public class BoatDatabase extends CouchDbRepositorySupport<Boat> implements
		IBoatDatabase {

	private final ILogger logger;
	
	@Inject
	protected BoatDatabase(@Named("boatCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Boat.class, db);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("BoatDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IBoat data) {
		Boat entity = (Boat)data;
		
		if (entity.isNew()) {
			logger.info("BoatDatabase", "Saving entity");
			add(entity);
			return true;
		}
			
		logger.info("BoatDatabase", "Updating entity with UUID: " + entity.getId());
		update(entity);
		return false;
	}

	@Override
	public IBoat get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IBoat> loadAll() {
		List<IBoat> boats = new LinkedList<IBoat>(getAll());
		logger.info("BoatDatabase", "Loaded entities. Count: " + boats.size());
		return boats;
	}

	@Override
	public void delete(UUID id) {
		logger.info("BoatDatabase", "Removing entity with UUID: " + id.toString());
		remove((Boat)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
