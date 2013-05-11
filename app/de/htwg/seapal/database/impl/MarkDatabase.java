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
		super(Mark.class, db);
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
		add((Mark) data);

		return false;
	}

	@Override
	public IMark get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IMark> loadAll() {
		return new LinkedList<IMark>(getAll());
	}

	@Override
	public void delete(UUID id) {
		remove((Mark)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
