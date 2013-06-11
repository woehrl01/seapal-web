package de.htwg.seapal.database.impl;

import static org.junit.Assert.*;

import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Test;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.htwg.seapal.database.IBoatDatabase;
import de.htwg.seapal.model.IBoat;
import de.htwg.seapal.model.impl.Boat;
import de.htwg.seapal.module.SeapalTestModule;

public class BoatDatabaseTest {
	IBoatDatabase database;

	Logger log = Logger.getLogger(BoatDatabaseTest.class);

	@Before
	public void setUp() throws Exception {
		Injector injector = Guice.createInjector(new SeapalTestModule());
		this.database = injector.getInstance(IBoatDatabase.class);
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Test
	public void testSaveDocument_nameShouldBeEqual() {
		IBoat savedBoat = new Boat();
		savedBoat.setBoatName("test_boat_name");

		database.save(savedBoat);

		IBoat loadedBoat = database.get(savedBoat.getUUID());

		assertEquals(savedBoat.getBoatName(), loadedBoat.getBoatName());
	}

	@Test
	public void testSaveDocument_nameShouldNotBeEqual() {
		IBoat savedBoat = new Boat();
		savedBoat.setBoatName("test_boat_name1");

		database.save(savedBoat);

		IBoat anotherSavedBoat = new Boat();
		anotherSavedBoat.setBoatName("test_boat_name2");

		database.save(anotherSavedBoat);

		IBoat loadedBoat = database.get(savedBoat.getUUID());
		IBoat anotherLoadedBoat = database.get(anotherSavedBoat.getUUID());
		
		log.info(loadedBoat);
		log.info(anotherLoadedBoat);

		assertFalse(loadedBoat.equals(anotherLoadedBoat));
	}

	@Test
	public void testUpdateDocument_countShouldBeEqaualAsBefore() {
		List<IBoat> boats = database.loadAll();
		int countBeforeUpdate = boats.size();
		UUID boatId = null;
		
		// insert a boat, if the db is empty
		if (countBeforeUpdate == 0) {
			IBoat newBoat = new Boat();
			boatId = newBoat.getUUID();
			newBoat.setBoatName("update-test-boat");
			database.save(newBoat);
			countBeforeUpdate++;
		} else {
			boatId = boats.get(0).getUUID();
		}
		
		assertNotNull(boatId);
		
		IBoat loadedBoat = database.get(boatId);
		loadedBoat.setBoatName("updated-test-boat" + (int)(Math.random() * 100));
		database.save(loadedBoat);
		
		assertEquals(countBeforeUpdate, database.loadAll().size());
	}
}
