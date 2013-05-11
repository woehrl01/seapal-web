package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.CouchDbConnector;
import org.ektorp.support.CouchDbRepositorySupport;

import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IPersonDatabase;
import de.htwg.seapal.model.IPerson;
import de.htwg.seapal.model.impl.Person;
import de.htwg.seapal.utils.logging.ILogger;

public class PersonDatabase extends CouchDbRepositorySupport<Person> implements
		IPersonDatabase {

	private final ILogger logger;
	
	@Inject
	protected PersonDatabase(@Named("personCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Person.class, db);
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("PersonDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IPerson data) {
		add((Person) data);

		return false;
	}

	@Override
	public IPerson get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IPerson> loadAll() {
		return new LinkedList<IPerson>(getAll());
	}

	@Override
	public void delete(UUID id) {
		remove((Person)get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

}
