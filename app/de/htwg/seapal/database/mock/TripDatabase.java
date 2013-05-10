package de.htwg.seapal.database.mock;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.model.IPerson;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;

public class TripDatabase implements ITripDatabase {

	Map<UUID, ITrip> db = new HashMap<UUID, ITrip>();
	private ITrip newTrip;
	
	public TripDatabase() {
		open();
	}
	
	private UUID createNewTripInDatabase() {
		ITrip trip = new Trip();
		UUID id = trip.getUUID();
		db.put(id, trip);
		return id;
	}

	@Override
	public boolean open() {
		// create test data
		UUID id = createNewTripInDatabase();
		newTrip = get(id);
		newTrip.setName("Trip-NEW");
		save(newTrip);
		for (int i = 1; i < 10; i++) {
			id = createNewTripInDatabase();
			ITrip trip = get(id);
			trip.setName("Trip-" + i);
			save(trip);
		}
		return true;
	}
	
	@Override
	public boolean close() {
		return true;
	}

	@Override
	public UUID create() {
		return newTrip.getUUID();
	}

	@Override
	public void delete(UUID id) {
		if (db.containsKey(id)) {
			db.remove(id);
		}
	}

	@Override
	public ITrip get(UUID id) {
		return new Trip(db.get(id));
	}

	@Override
	public List<ITrip> getAll() {
		Collection<ITrip> collection = db.values();
		List<ITrip> values = new ArrayList<ITrip>(collection);
		return values;
	}

	@Override
	public boolean save(ITrip trip) {
		return (db.put(trip.getUUID(), trip) == null);
	}
}
