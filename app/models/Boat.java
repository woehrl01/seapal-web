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
	public Integer bla;

	@Required
	public String name;

	public static Finder<Long, Boat> find = new Finder<Long, Boat>(Long.class,
			Boat.class);

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
