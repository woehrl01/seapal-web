package de.htwg.seapal.database.impl;

import static org.junit.Assert.assertEquals;

import org.apache.log4j.Logger;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Test;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.htwg.seapal.database.IWaypointDatabase;
import de.htwg.seapal.model.IWaypoint;
import de.htwg.seapal.model.impl.Waypoint;
import de.htwg.seapal.module.SeapalTestModule;

public class WaypointDatabaseTest {

	IWaypointDatabase waypointDatabase;

	Logger log = Logger.getLogger(WaypointDatabaseTest.class);

	@Before
	public void setUp() throws Exception {
		Injector injector = Guice.createInjector(new SeapalTestModule());
		this.waypointDatabase = injector.getInstance(IWaypointDatabase.class);
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Test
	public void testSaveDocument_documentsShouldBeEqual() {
		IWaypoint savedWaypoint = new Waypoint();
		savedWaypoint.setName("testSaveDocument_documentsShouldBeEqual");

		waypointDatabase.save(savedWaypoint);

		IWaypoint loadedWaypoint = waypointDatabase
				.get(savedWaypoint.getUUID());
		
		log.info(loadedWaypoint);

		assertEquals(savedWaypoint, loadedWaypoint);
	}
}
