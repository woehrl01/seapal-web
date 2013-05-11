package de.htwg.seapal.database.impl;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import org.apache.log4j.Logger;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.htwg.seapal.database.ITripDatabase;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.impl.Trip;
import de.htwg.seapal.module.TripCouchDbModule;


public class TripDatabaseTest {

	ITripDatabase tripDatabase;

	Logger log = Logger.getLogger(TripDatabaseTest.class);

	@Before
	public void setUp() throws Exception {
		Injector injector = Guice.createInjector(new TripCouchDbModule());
		this.tripDatabase = injector.getInstance(ITripDatabase.class);
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Test
	public void testSaveDocument_documentsShouldBeEqual() {
		ITrip savedTrip = new Trip();
		savedTrip.setBoat("testSaveDocument_documentsShouldBeEqual");

		tripDatabase.save(savedTrip);

		ITrip loadedTrip = tripDatabase.get(savedTrip.getUUID());

		assertEquals(savedTrip, loadedTrip);
	}

	@Test
	public void testSaveDocument_documentsShouldNotBeEqual() {
		ITrip savedTrip = new Trip();
		savedTrip.setBoat("testSaveDocument_documentsShouldNotBeEqual");

		tripDatabase.save(savedTrip);

		ITrip anotherSavedTrip = new Trip();
		anotherSavedTrip.setBoat("testSaveDocument_documentsShouldNotBeEqual");

		tripDatabase.save(anotherSavedTrip);

		ITrip loadedTrip = tripDatabase.get(savedTrip.getUUID());
		ITrip anotherLoadedTrip = tripDatabase.get(anotherSavedTrip.getUUID());
		
		log.info(loadedTrip);
		log.info(anotherLoadedTrip);

		assertFalse(loadedTrip.equals(anotherLoadedTrip));
	}

	@Test
	@Ignore
	public void testGetAllDocuments_shouldReturnAList() {
		log.info(tripDatabase.loadAll());
	}

}
