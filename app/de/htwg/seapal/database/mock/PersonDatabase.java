package de.htwg.seapal.database.mock;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.google.common.collect.ImmutableList;

import de.htwg.seapal.database.IPersonDatabase;
import de.htwg.seapal.model.IPerson;
import de.htwg.seapal.model.impl.Person;

public class PersonDatabase implements IPersonDatabase {

	Map<UUID, IPerson> db = new HashMap<UUID, IPerson>();
	private IPerson newPerson;
	
	public PersonDatabase() {
		open();
	}
	
	private UUID createNewPersonInDatabase() {
		IPerson person = new Person();
		UUID id = person.getUUID();
		db.put(id, person);
		return id;
	}
	
	@Override
	public boolean open() {
		// create test data
		UUID id = createNewPersonInDatabase();
		newPerson = get(id);
		newPerson.setFirstname("Firstname-NEW");
		newPerson.setLastname("Firstname-NEW");
		save(newPerson);
		for (int i = 1; i < 10; i++) {
			id = createNewPersonInDatabase();
			IPerson person = get(id);
			person.setFirstname("Firstname-" + i);
			person.setLastname("Firstname-" + i);
			save(person);
		}
		return true;
	}
	
	@Override
	public boolean close() {
		return true;
	}

	@Override
	public void delete(UUID id) {
		db.remove(id);
	}

	@Override
	public IPerson get(UUID id) {
		return new Person(db.get(id));
	}

	@Override
	public List<IPerson> loadAll() {
		return ImmutableList.copyOf(db.values());
	}

	@Override
	public UUID create() {
		return newPerson.getUUID();
	}

	@Override
	public boolean save(IPerson person) {
		return (db.put(person.getUUID(), person) == null);
	}
}
