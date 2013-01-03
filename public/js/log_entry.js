/* boat_info.js */

$(document).ready(function() {

	$('#form').submit(function(event) {
		event.preventDefault();
		var tripId = $('#trip_id').val();
		console.log(tripId);

		jsRoutes.controllers.WaypointAPI.addWaypoint().ajax({
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				if(data.success){
					$('#addSuccessModal').modal('show');
					window.setTimeout(function (){
						window.location.href = jsRoutes.controllers.Application.trip_edit(tripId).url;
					}, 2000);
				}else{
					console.log(data.errors);
					alert("Serverside error occured!");
				}
			}
		});
	});

	$('.datepicker-small').datepicker();

	function initStaticSeamap(waypoints) {
		jsonObj = [];
		console.log(jsonObj);
		for (var i = 0; i < waypoints.length; i++) {
			console.log(waypoints[i].position_lat);
			jsonObj.push({lat: waypoints[i].position_lat, lng : waypoints[i].position_lon});
		}

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

	function loadWaypoint( itemId) {
		$.ajax({
			type: "GET",
			url: $('#form').attr('action'),
			data: {id: itemId},
			dataType: "json",
			success: function(item) {
				populateJSON('#form input', item);
				$('html, body').animate({ scrollTop: 0 }, 600);

				initStaticSeamap(item);
			}
		});
	}
});

