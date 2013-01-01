package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class Boat extends Model {

	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	
	@Required
	public String boat_name;
	
	private String boat_type;
    private double build_year;
    private String register_nr;
    private String constructor;
    private String engine;
    private String sail_sign;
    private double boat_length;
    private double fueltank_size;
    private String home_port;
    private double boat_width;
    private double watertank_size;
    private double draught;
    private String yachtclub;
    private double wastewatertank_size;
    private String owner;
    private double mast_height;
    private double mainsail_size;
    private String insurance;
    private double water_displacement;
    private double genua_size;
    private String callsign;
    private String rig_kind;
    private double spi_size;
	
	
	

	public static Finder<Long, Boat> find = new Finder<Long, Boat>(Long.class, Boat.class);

	public static List<Boat> all() {
		return find.all();
	}

	public static void create(Boat boat) {
		boat.save();
	}
	
	public static Boat get(Long id) {
		return find.ref(id);
	}

	public static void delete(Long id) {
		find.ref(id).delete();
	}
}
