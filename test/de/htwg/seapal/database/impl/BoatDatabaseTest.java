package de.htwg.seapal.database.impl;

import static org.junit.Assert.*;

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

}
