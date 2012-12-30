package de.seapal.gwt.client;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

/**
 * The client side stub for the RPC service.
 */
@RemoteServiceRelativePath("boatservice")
public interface BoatService extends RemoteService {
	String saveBoat(String name, String registernr, String typ, String baujahr) throws IllegalArgumentException;
}
