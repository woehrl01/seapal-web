package de.htwg.seapal.database.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.ektorp.ComplexKey;
import org.ektorp.CouchDbConnector;
import org.ektorp.ViewQuery;
import org.ektorp.support.CouchDbRepositorySupport;
import org.ektorp.support.GenerateView;

import com.google.common.collect.ImmutableList;
import com.google.inject.Inject;
import com.google.inject.name.Named;

import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.model.IWaypoint;
import de.htwg.seapal.model.impl.Waypoint;
import de.htwg.seapal.utils.logging.ILogger;

public class WaypointDatabase extends CouchDbRepositorySupport<Waypoint> implements IWaypointDatabase {

	private final ILogger logger;
	
	@Inject
	protected WaypointDatabase(@Named("waypointCouchDbConnector") CouchDbConnector db, ILogger logger) {
		super(Waypoint.class, db, true);
		super.initStandardDesignDocument();
		this.logger = logger;
	}

	@Override
	public boolean open() {
		logger.info("WaypointDatabase", "Database connection opened");
		return true;
	}

	@Override
	public UUID create() {
		return null;
	}

	@Override
	public boolean save(IWaypoint data) {
		Waypoint entity = (Waypoint)data;
		
		if (entity.isNew()) {
			// ensure that the id is generated and revision is null for saving a new entity
			entity.setId(UUID.randomUUID().toString());
			entity.setRevision(null);
			add(entity);
			return true;
		}
		
		logger.info("WaypointDatabase", "Updating entity with UUID: " + entity.getId());
		update(entity);
		return false;
	}

	@Override
	public Waypoint get(UUID id) {
		return get(id.toString());
	}

	@Override
	public List<IWaypoint> loadAll() {
		List<IWaypoint> waypoints = new LinkedList<IWaypoint>(getAll());
		logger.info("WaypointDatabase", "Loaded entities. Count: " + waypoints.size());
		return waypoints;
	}

	@Override
	public void delete(UUID id) {
		logger.info("WaypointDatabase", "Removing entity with UUID: " + id.toString());
		remove(get(id));
	}

	@Override
	public boolean close() {
		return true;
	}

	@Override
	public List<IWaypoint> loadAllByTripId(UUID tripId) {
		/*ViewQuery query = new ViewQuery()
						.designDocId("_design/Waypoint")
						.viewName("by_trip_sortedxxx");*/
		
		
		//logger.info("WaypointDatabase", "Load all by ID count:" + db.queryView(query, Waypoint.class).size());
		//return new LinkedList<IWaypoint>(db.queryView(query, Waypoint.class));
		//return new LinkedList<IWaypoint>(queryView("by_trip", tripId.toString()));
		return findByTrip(tripId);
	}
	
	@GenerateView
	public List<IWaypoint> findByTrip(UUID tripId) {
		return new LinkedList<IWaypoint>(queryView("by_trip", tripId.toString()));
	}

}
