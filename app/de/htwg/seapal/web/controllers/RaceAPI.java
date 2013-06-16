package de.htwg.seapal.web.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import play.Logger;
import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.With;

import com.google.inject.Inject;

import de.htwg.seapal.controller.IBoatController;
import de.htwg.seapal.controller.IRaceController;
import de.htwg.seapal.controller.ITripController;
import de.htwg.seapal.controller.IWaypointController;
import de.htwg.seapal.model.IBoat;
import de.htwg.seapal.model.IRace;
import de.htwg.seapal.model.IRace.RaceBoat;
import de.htwg.seapal.model.IRace.RaceControlPoint;
import de.htwg.seapal.model.IRace.RaceCoordinate;
import de.htwg.seapal.model.IRace.RaceTrip;
import de.htwg.seapal.model.IRace.RaceWaypoint;
import de.htwg.seapal.model.ITrip;
import de.htwg.seapal.model.IWaypoint;
import de.htwg.seapal.model.impl.Race;
import de.htwg.seapal.utils.logging.ILogger;
import de.htwg.seapal.web.controllers.helpers.Menus;
import de.htwg.seapal.web.views.html.content.racemap;

@With(Menus.class)
public class RaceAPI extends Controller {

    @Inject
    private ILogger logger;

    @Inject
    private IRaceController raceController;

    @Inject
    private ITripController tripController;

    @Inject
    private IBoatController boatController;

    @Inject
    private IWaypointController waypointController;
    
    public Result addRace() {

    	ObjectNode response = Json.newObject();
    	ObjectMapper mapper = new ObjectMapper();
    	mapper.configure(org.codehaus.jackson.map.DeserializationConfig.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
    	
    	try {
    		Race raceToSave = mapper.readValue(request().body().asJson(), Race.class);
			response.put("success", true);
			boolean created = raceController.saveRace(raceToSave);
			if(created) {
				logger.info("RaceAPI", "Race created");
				return created(response);
			} else {
				logger.info("BoatAPI", "Race updated");
				return ok(response);
			}
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		response.put("success", false);
    	return badRequest(response);
    }

    public Result raceAsJson(UUID raceId) {
        IRace race = raceController.getRace(raceId);

        if (race == null) {
            return badRequest("race not found");
        }
        logger.info("RaceAPI", "Loaded race name: " + race.getName());

      //Recalculate SOG and COG
        
        for(RaceTrip trip : race.getTrips()){
            RaceWaypoint prev = trip.waypoints.get(0);
            for(RaceWaypoint curr : trip.waypoints){
                curr.sog = (int) Math.ceil(gps2m(prev.coord.lat, prev.coord.lng, curr.coord.lat, curr.coord.lng) / ((double)(curr.timestamp-prev.timestamp)/1000.0));
                curr.cog = (int) bearing(prev.coord.lat, prev.coord.lng, curr.coord.lat, curr.coord.lng);
                prev = curr;
            }
            
            
            //fake start and goal passing :)
            //trip.waypoints.get(3).markPassing = race.getControlPoints().get(0).id;
            //trip.waypoints.get(trip.waypoints.size()-3).markPassing = race.getControlPoints().get(race.getControlPoints().size()-1).id;
        }

        
        return ok(Json.toJson(race));
    }

    public Result testRaceAsJson() {
        ObjectNode race = generateTestRace("test", "KN Woche");

        return ok(race);
    }

    public Result databaseEktorpRace() {
        JsonNode race = generateFromDataBase("TestDatabaseRace", "49er");
        
        return ok(race);
    }

    private JsonNode generateFromDataBase(String raceName, String boatClass) {
        List<UUID> trips = new LinkedList<UUID>();
        trips.add(UUID.fromString("065455a4-44b2-46c7-a820-e056180d2d3e"));
        
        
        IRace raceWithoutControlPoints = generateRaceWithoutControlPoints(raceName, boatClass, trips);
        
        List<RaceControlPoint> controlPoints = new LinkedList<RaceControlPoint>();
        
        
        controlPoints.add(new RaceControlPoint("controlPoints1", "Start", coords(47.66260549, 9.16618109, 47.6620202, 9.16602015)));

        controlPoints.add(new RaceControlPoint("controlPoints2", "Buoy", coords(47.66244652, 9.16642785)));
        
        controlPoints.add(new RaceControlPoint("controlPoints3", "Buoy", coords(47.66467926, 9.1654408)));

        controlPoints.add(new RaceControlPoint("controlPoints4", "Buoy", coords(47.6645492, 9.16800499)));

        controlPoints.add(new RaceControlPoint("controlPoints5", "Buoy", coords(47.66558967, 9.16870236)));
        
        controlPoints.add(new RaceControlPoint("controlPoints6", "Goal", coords(47.66532233, 9.17297244, 47.66486712, 9.17275786)));
        
        raceWithoutControlPoints.setControlPoints(controlPoints);
        
        raceWithoutControlPoints.getTrips().get(0).waypoints.get(3).markPassing = "controlPoints1";
        raceWithoutControlPoints.getTrips().get(0).waypoints.get((int) (raceWithoutControlPoints.getTrips().get(0).waypoints.size()*0.15)).markPassing = "controlPoints2";
        raceWithoutControlPoints.getTrips().get(0).waypoints.get((int) (raceWithoutControlPoints.getTrips().get(0).waypoints.size()*0.35)).markPassing = "controlPoints3";
        raceWithoutControlPoints.getTrips().get(0).waypoints.get((int) (raceWithoutControlPoints.getTrips().get(0).waypoints.size()*0.55)).markPassing = "controlPoints4";
        raceWithoutControlPoints.getTrips().get(0).waypoints.get((int) (raceWithoutControlPoints.getTrips().get(0).waypoints.size()*0.65)).markPassing = "controlPoints5";
        raceWithoutControlPoints.getTrips().get(0).waypoints.get(raceWithoutControlPoints.getTrips().get(0).waypoints.size()-3).markPassing = "controlPoints6";
        
        
        //Recalculate SOG and COG
        RaceWaypoint prev = raceWithoutControlPoints.getTrips().get(0).waypoints.get(0);
        for(RaceWaypoint curr : raceWithoutControlPoints.getTrips().get(0).waypoints){
            curr.sog = (int) Math.ceil(gps2m(prev.coord.lat, prev.coord.lng, curr.coord.lat, curr.coord.lng) / ((double)(curr.timestamp-prev.timestamp)/1000.0));
            curr.cog = (int) bearing(prev.coord.lat, prev.coord.lng, curr.coord.lat, curr.coord.lng);
            prev = curr;
        }
        
        return Json.toJson(raceWithoutControlPoints);
        
    }
    
    protected double bearing(double lat1, double lon1, double lat2, double lon2){
        double longitude1 = lon1;
        double longitude2 = lon2;
        double latitude1 = Math.toRadians(lat1);
        double latitude2 = Math.toRadians(lat2);
        double longDiff= Math.toRadians(longitude2-longitude1);
        double y= Math.sin(longDiff)*Math.cos(latitude2);
        double x=Math.cos(latitude1)*Math.sin(latitude2)-Math.sin(latitude1)*Math.cos(latitude2)*Math.cos(longDiff);

        return (Math.toDegrees(Math.atan2(y, x))+360)%360;
      }
    
    private double gps2m(double lat_a, double lng_a, double lat_b, double lng_b) {
        double pk = (double) (180/3.14169);

        double a1 = lat_a / pk;
        double a2 = lng_a / pk;
        double b1 = lat_b / pk;
        double b2 = lng_b / pk;

        double t1 = Math.cos(a1)*Math.cos(a2)*Math.cos(b1)*Math.cos(b2);
        double t2 = Math.cos(a1)*Math.sin(a2)*Math.cos(b1)*Math.sin(b2);
        double t3 = Math.sin(a1)*Math.sin(b1);
        double tt = Math.acos(t1 + t2 + t3);

        return 6366000*tt;
    }
    
    public List<RaceCoordinate> coords(double lat1, double lng1, double lat2, double lng2){
        return Arrays.asList(new RaceCoordinate(lat1, lng1), new RaceCoordinate(lat2, lng2)); 
    }
    
    public List<RaceCoordinate> coords(double lat1, double lng1){
        return Arrays.asList(new RaceCoordinate(lat1, lng1)); 
    }

    public Result allRacesAsJson() {
        List<IRace> races = raceController.getAllRaces();
        if (races == null) {
            return badRequest("race not found");
        }
        logger.info("RaceAPI", "Loaded races count: " + races.size());

        List<JsonNode> raceNodes = new ArrayList<JsonNode>();

        for (IRace race : races) {

            raceNodes.add(generateLinkedRace(race));
        }

        return ok(Json.toJson(raceNodes));
    }

    private ObjectNode generateLinkedRace(IRace race) {
        ObjectNode raceNode = Json.newObject();

        raceNode.put("id", race.getId());
        raceNode.put("name", race.getName());
        raceNode.put("boatClass", race.getBoatClass());

        ArrayNode links = raceNode.putArray("links");
        ObjectNode raceLink = Json.newObject();
        raceLink.put("rel", "self");
        raceLink.put("href", de.htwg.seapal.web.controllers.routes.RaceAPI.raceAsJson(race.getUUID()).absoluteURL(request()));
        links.add(raceLink);

        return raceNode;
    }

    public Result deleteRace(UUID id) {
        raceController.deleteRace(id);
        ObjectNode response = Json.newObject();
        response.put("success", true);

        return ok(response);
    }

    public Result raceDataByTripIds() {
        Form<RaceList> form = Form.form(RaceList.class);
        RaceList race = form.bindFromRequest().get();

        IRace raceWithoutControlPoints = generateRaceWithoutControlPoints(race.name, race.boatClass, race.tripsAsUUID());

        return ok(racemap.render(Json.toJson(raceWithoutControlPoints).toString()));
    }

    public static class RaceList {
        public List<String> tripIds = new LinkedList<String>();
        public String name;
        public String boatClass;

        public List<UUID> tripsAsUUID() {
            List<UUID> list = new ArrayList<UUID>(tripIds.size());

            for (String id : tripIds) {
                list.add(UUID.fromString(id));
            }
            return list;
        }
    }

    private IRace generateRaceWithoutControlPoints(String name, String boatClass, List<UUID> tripIds) {
        IRace race = new Race();
        race.setName(name);
        race.setBoatClass(boatClass);
        race.setTrips(generateTrips(tripIds));
        // Note: no control points should be generated here ;)

        return race;
    }

    private List<RaceTrip> generateTrips(List<UUID> tripIds) {
        List<RaceTrip> trips = new ArrayList<RaceTrip>();
        for (UUID tripId : tripIds) {
            ITrip trip = tripController.getTrip(tripId);

            trips.add(new RaceTrip(trip.getId(), trip.getName(), generateBoat(UUID.fromString(trip.getBoat())),
                    generateWaypointsOfTrip(UUID.fromString(trip.getId()))));
        }
        return trips;
    }

    private List<RaceWaypoint> generateWaypointsOfTrip(UUID tripId) {
        List<IWaypoint> waypoints = waypointController.getAllWaypoints(tripId);
        
        Logger.info("Waypoints: " + waypoints.size());
        
        Collections.sort(waypoints, new Comparator<IWaypoint>(){

            @Override
            public int compare(IWaypoint arg0, IWaypoint arg1) {
                return arg0.getDate().compareTo(arg1.getDate());
            }
            
        });
        
        List<RaceWaypoint> raceWaypoints = new LinkedList<RaceWaypoint>();

        for (IWaypoint waypoint : waypoints) {
            raceWaypoints.add(new RaceWaypoint(waypoint.getId(), new RaceCoordinate(waypoint.getLatitude(), waypoint
                    .getLongitude()), waypoint.getDate(), waypoint.getSOG(), waypoint.getCOG(), waypoint.getBTM(),
                    waypoint.getDTM(), null));
        }
        
        for(RaceWaypoint waypoint : raceWaypoints){
            waypoint.timestamp *= 1000;
        }
        
        Logger.info("RaceWaypoints: " + raceWaypoints.size());
      
        return raceWaypoints;
    }

    private RaceBoat generateBoat(UUID boatId) {
        IBoat boat = boatController.getBoat(boatId);

        return new RaceBoat(boat.getId(), boat.getBoatName(), "GER"); // TODO: implement real ioc-code
    }

    private ObjectNode generateTestRace(String id, String name) {
        ObjectNode race = Json.newObject();

        race.put("_id", id);
        race.put("name", name);
        race.put("boatClass", "49er");

        ArrayNode trips = race.putArray("trips");
        trips.add(generateTestTrip(trips, id + "-tripId1", "Test trip 1", 0));
        trips.add(generateTestTrip(trips, id + "-tripId2", "Test trip 2", 0.01));

        ArrayNode controlPoints = race.putArray("controlPoints");
        controlPoints.add(generateTestControlPoint(id + "-controlPointId1", 39.9, 50.0, 40.1, 50.0)); // start
        controlPoints.add(generateTestControlPoint(id + "-controlPointId2", 41.9, 50.1));
        controlPoints.add(generateTestControlPoint(id + "-controlPointId3", 42.1, 51.9));
        controlPoints.add(generateTestControlPoint(id + "-controlPointId4", 43.9, 52.0, 44.1, 52.0)); // goal

        return race;
    }

    private JsonNode generateTestTrip(ArrayNode trips, String id, String name, double offset) {
        ObjectNode trip = Json.newObject();
        trip.put("id", id);
        trip.put("name", name);
        trip.put("boat", generateTestBoat(id + "+boatId1", "Titanic", "GER"));
        ArrayNode waypoints = trip.putArray("waypoints");
        waypoints.add(generateTestWaypoint(id + "-waypointId1", 40.0 + offset, 50.0 - offset, 1000000,
                "test-controlPointId1"));
        waypoints.add(generateTestWaypoint(id + "-waypointId2", 41.0 + offset, 50.0 - offset, 1010000, null));
        waypoints.add(generateTestWaypoint(id + "-waypointId3", 42.0 + offset, 50.0 - offset, 1020000,
                "test-controlPointId2"));
        waypoints.add(generateTestWaypoint(id + "-waypointId4", 42.0 + offset, 51.0 - offset, 1030000, null));
        waypoints.add(generateTestWaypoint(id + "-waypointId5", 42.0 + offset, 52.0 - offset, 1040000,
                "test-controlPointId3"));
        waypoints.add(generateTestWaypoint(id + "-waypointId6", 43.0 + offset, 52.0 - offset, 1050000, null));
        waypoints.add(generateTestWaypoint(id + "-waypointId7", 44.0 + offset, 52.0 - offset, 1060000,
                "test-controlPointId4"));
        return trip;
    }

    private JsonNode generateTestBoat(String id, String name, String iocCode) {
        ObjectNode boat = Json.newObject();
        boat.put("id", id);
        boat.put("name", name);
        boat.put("IOCCode", iocCode);
        return boat;
    }

    private JsonNode generateTestWaypoint(String id, double lat, double lng, long timestamp, String markPassingId) {
        ObjectNode waypoint = Json.newObject();
        waypoint.put("id", id);
        ObjectNode coord = waypoint.putObject("coord");
        coord.put("lat", lat);
        coord.put("lng", lng);
        waypoint.put("timestamp", timestamp);
        waypoint.put("sog", 10.0);
        waypoint.put("cog", 10.0);
        waypoint.put("markPassing", markPassingId);
        return waypoint;
    }

    private JsonNode generateTestControlPoint(String id, double lat1, double lng1) {
        ObjectNode controlPoint = Json.newObject();
        controlPoint.put("id", id);

        ArrayNode coords = controlPoint.putArray("coords");
        ObjectNode coord1 = Json.newObject();
        coord1.put("lat", lat1);
        coord1.put("lng", lng1);
        coords.add(coord1);

        return controlPoint;
    }

    private JsonNode generateTestControlPoint(String id, double lat1, double lng1, double lat2, double lng2) {
        ObjectNode controlPoint = Json.newObject();
        controlPoint.put("id", id);

        ArrayNode coords = controlPoint.putArray("coords");
        ObjectNode coord1 = Json.newObject();
        coord1.put("lat", lat1);
        coord1.put("lng", lng1);
        coords.add(coord1);

        ObjectNode coord2 = Json.newObject();
        coord2.put("lat", lat2);
        coord2.put("lng", lng2);
        coords.add(coord2);

        return controlPoint;
    }
}
