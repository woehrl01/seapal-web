/* boat_info.js */

$(document).ready(function() {
	
	var waypointId = $('#waypoint_id').val();
	
	if (waypointId != "") {
		loadWaypoint(waypointId);
	}
	
	$('#form').submit(function(event) {
		event.preventDefault();
		var tripId = $('#trip_id').val();

		// convert the date to unix timestamp
		var $date = $(this.date)
		$date.val(Date.parse($date.val())/1000);
		var $waypointData = $(this);
		$(this).date = $date.val();
		
		jsRoutes.de.htwg.seapal.web.controllers.WaypointAPI.addWaypoint().ajax({
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				if(data.success){
					$('#addSuccessModal').modal('show');
					window.setTimeout(function (){
						window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.trip_edit(tripId).url;
					}, 2000);
				}else{
					console.log(data.errors);
					alert("Serverside error occured!");
				}
			}
		});
	});
	
	

	$('.datepicker-small').datepicker();

	function initStaticSeamap(waypoint) {
		jsonObj = [];
		
		jsonObj.push({lat: waypoint.latitude, lng : waypoint.longitude});
		
		console.log(jsonObj);

		var config = {
			defaultRoute 	: jsonObj,
			height 			: '350px',
			mode 			: "NOTINTERACTIVE" 
		};
		
		if(jsonObj.length > 0) {
			config.startLat  = jsonObj[0].lat;
			config.startLong = jsonObj[0].lng;
		}

		$("#mini_map").seamap(config);
	}

	function populateJSON( item, data){
		var $inputs = $(item);
		$.each(data, function(key, value) {
		  $inputs.filter(function() {
		    return key == this.name;
		  }).val(value);
		});
	}

	function loadWaypoint(waypointId) {
		jsRoutes.de.htwg.seapal.web.controllers.WaypointAPI.waypointAsJson(waypointId).ajax({
			dataType: "json",
			success: function(waypoint) {
				populateJSON('#form input', waypoint);
				initStaticSeamap(waypoint);
			}
		});
	}
});

