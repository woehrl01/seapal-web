package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IMarkDatabase;
import de.htwg.seapal.model.IMark;
import de.htwg.seapal.model.impl.Mark;
import de.htwg.seapal.utils.logging.ILogger;

public class MarkDatabase extends CouchDbRepositorySupport<Mark> implements
		IMarkDatabase {

	private final ILogger logger;
	
	@Inject
	protected MarkDatabase(@Named("markCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Mark.class, db, true);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("MarkDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IMark data) {
		Mark entity = (Mark)data;
		
		if (entity.isNew()) {
			// ensure that the id is generated and revision is null for saving a new entity
			entity.setId(UUID.randomUUID().toString());
			entity.setRevision(null);
			add(entity);
			return true;
		}
			
		logger.info("MarkDatabase", "Updating entity with UUID: " + entity.getId());
		update(entity);
		return false;
	}

	@Override
	public IMark get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IMark> loadAll() {
		List<IMark> marks = new LinkedList<IMark>(getAll());
		logger.info("MarkDatabase", "Loaded entities. Count: " + marks.size());
		return marks;
	}

	@Override
	public void delete(UUID id) {
		logger.info("MarkDatabase", "Removing entity with UUID: " + id.toString());
		remove((Mark)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
