package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IRaceDatabase;
import de.htwg.seapal.model.IRace;
import de.htwg.seapal.model.impl.Race;
import de.htwg.seapal.utils.logging.ILogger;

public class RaceDatabase extends CouchDbRepositorySupport<Race> implements IRaceDatabase {

	private final ILogger logger;
	
	@Inject
	protected RaceDatabase(@Named("raceCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Race.class, db, true);
		super.initStandardDesignDocument();
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("RaceDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IRace data) {
		Race entity = (Race)data;
		
		if (entity.isNew()) {
			// ensure that the id is generated and revision is null for saving a new entity
			entity.setId(UUID.randomUUID().toString());
			entity.setRevision(null);
			add(entity);
			return true;
		}
		
		update(entity);
		return false;
	}

	@Override
	public IRace get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IRace> loadAll() {
		List<IRace> races = new LinkedList<IRace>(getAll());
		logger.info("RaceDatabase", "Loaded entities. Count: " + races.size());
		return races;
	}

	@Override
	public void delete(UUID id) {
		logger.info("RaceDatabase", "Removing entity with UUID: " + id.toString());
		remove((Race)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}
}
