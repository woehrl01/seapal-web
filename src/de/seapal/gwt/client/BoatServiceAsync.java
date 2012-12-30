package de.seapal.gwt.client;

import com.google.gwt.user.client.rpc.AsyncCallback;

/**
 * The async counterpart of <code>BoatService</code>.
 */
public interface BoatServiceAsync {
	void saveBoat(String name, String registernr, String typ, String baujahr, AsyncCallback<String> callback)
			throws IllegalArgumentException;
}
