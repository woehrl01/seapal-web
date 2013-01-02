package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

import play.data.validation.*;

@Entity
public class Boat extends Model {

	private static final long serialVersionUID = 1L;

	@Id
	@Constraints.Min(0)
	private Long id;
	
	@Constraints.Required
	public String boat_name;
	
	public String boat_type;
	
	@Constraints.Min(1900)
	public Integer build_year;
	
	public String register_nr;
	
	public String constructor;
	
	public String engine;
	
	public String sail_sign;
	
	@Constraints.Min(0)
	public Double boat_length;

	@Constraints.Min(0)
	public Double fueltank_size;
	
	public String home_port;

	@Constraints.Min(0)
	public Double boat_width;

	@Constraints.Min(0)
	public Double watertank_size;

	@Constraints.Min(0)
	public Double draught;
	
	public String yachtclub;

	@Constraints.Min(0)
	public Double wastewatertank_size;
	
	public String owner;

	@Constraints.Min(0)
	public Double mast_height;

	@Constraints.Min(0)
	public Double mainsail_size;
	
    public String insurance;

	@Constraints.Min(0)
    public Double water_displacement;

	@Constraints.Min(0)
    public Double genua_size;
	
    public String callsign;
    
    public String rig_kind;

	@Constraints.Min(0)
    public Double spi_size;
	
	
	/* end of fields */
    
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		if(id > 0){
			this.id = id;
		}
	}

	/* end of getter/setter */

	public static Finder<Long, Boat> find = new Finder<Long, Boat>(Long.class, Boat.class);

	public static List<Boat> all() {
		return find.all();
	}
	
	public static void update(Boat boat){
		boat.update(boat.getId());
	}

	public static void create(Boat boat) {
		boat.save();
	}
	
	public static Boat findById(Long id) {
		return Boat.find.ref(id);
	}

	public static void delete(Long id) {
		Boat.find.ref(id).delete();
	}
}
