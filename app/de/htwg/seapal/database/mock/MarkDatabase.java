package de.htwg.seapal.database.mock;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.google.common.collect.ImmutableList;

import de.htwg.seapal.database.IMarkDatabase;
import de.htwg.seapal.model.IMark;
import de.htwg.seapal.model.impl.Mark;

public class MarkDatabase implements IMarkDatabase {
	Map<UUID, IMark> db = new HashMap<UUID, IMark>();
	private IMark newMark;

	public MarkDatabase() {
		open();
	}
	
	@Override
	public boolean open() {
		// create test data
		UUID id = createNewMarkInDatabase();
		newMark = get(id);
		newMark.setName("Mark-NEW");
		save(newMark);
		for (int i = 1; i < 10; i++) {
			id = createNewMarkInDatabase();
			IMark mark = get(id);
			mark.setName("Mark-" + i);
			save(mark);
		}
		return true;
	}
	
	@Override
	public boolean close() {
		return true;
	}

	@Override
	public UUID create() {
		return newMark.getUUID();
	}

	private UUID createNewMarkInDatabase() {
		IMark mark = new Mark();
		UUID id = mark.getUUID();
		db.put(id, mark);
		return id;
	}

	@Override
	public boolean save(IMark mark) {
		return (db.put(mark.getUUID(), mark) == null);
	}

	@Override
	public void delete(UUID id) {
		db.remove(id);
	}

	@Override
	public IMark get(UUID id) {
		return new Mark(db.get(id));
	}

	@Override
	public List<IMark> loadAll() {
		return ImmutableList.copyOf(db.values());
	}
}
