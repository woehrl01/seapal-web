package models;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints;
import play.db.ebean.Model;

@Entity
public class Waypoint extends Model {
	
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	@Constraints.Required
    public Long trip_id;
	
	@Constraints.Required
    public String entry_name;
	
	public Long north_degree;
	public Long north_minutes;
	public Long north_seconds;
	public Long east_degree;
	public Long east_minutes;
	public Long east_seconds;
	
	public Long cog;
	public Long sog;
	
	public Date datetime;
	public Long btm;
	public Long dtm;
	public String note;
	public String trip_to;
	public Long maneuver_id;
	public Long headsail_id;
	public Long mainsail_id;

	/**
     * Calculates the lat/long value.
     * @param deg The degree value (pos/neg).
     * @param min The minutes value (pos).
     * @param sec The seconds value (pos).
     * @return An array of invalid fields.
     */
    private static double toLatLong(long deg, long min, long sec) {
        double res = deg;
        if (res > 0) {
            res += (min / 60f);
            res += (sec / 3600f);
        } else {
            res -= (min / 60f);
            res -= (sec / 3600f);
        }

        return res;
    }
    
    public Double getPosition_lon(){
    	if(north_degree != null && north_minutes != null && north_seconds != null)
    		return toLatLong(north_degree, north_minutes, north_seconds);
    	else
    		return null;
    }
    
    public Double getPosition_lat(){
    	if(east_degree != null && east_minutes != null && east_seconds != null)
    		return toLatLong(east_degree, east_minutes, east_seconds);
    	else
    		return null;
    }
    
	/* end of getter/setter */

	public static Finder<Long, Waypoint> find = new Finder<Long, Waypoint>(Long.class, Waypoint.class);

	public static List<Waypoint> all() {
		return find.all();
	}
	
	public static void update(Waypoint waypoint){
		waypoint.update(waypoint.id);
	}

	public static void create(Waypoint waypoint) {
		waypoint.save();
	}
	
	public static Waypoint findById(Long id) {
		return Waypoint.find.ref(id);
	}

	public static void delete(Long id) {
		Waypoint.find.ref(id).delete();
	}
	
}
