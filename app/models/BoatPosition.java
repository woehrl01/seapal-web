package models;

public class BoatPosition {
	private static double LEFT_LNG_LIMIT = 9.195;
	private static double RIGHT_LNG_LIMIT = 9.24;
			
	public double lat;
	public double lng;
	private int direction;
	
	public BoatPosition(double lat, double lng){
		this.lat = lat;
		this.lng = lng;
		this.direction = -1;
	}
	
	public void move(){
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
		}
		
		if (lng > RIGHT_LNG_LIMIT && direction > 0) {
			direction = -1;
		} else if (lng < LEFT_LNG_LIMIT && direction < 0) {
			direction = 1;
		}
		
		lat -= 0.0000;
		lng += 0.0019 * direction;
	}

}
