/* regatta.js */

$(document).ready(function() {
	//loadAllTrips();
	loadTrips();
	activateTabs();
	
	$(".tab-content").hide();
	
	/*function loadAllTrips() {
		var route = jsRoutes.de.htwg.seapal.web.controllers.RegattaAPI.allTripsAsJson();

		route.ajax({
			dataType: "json",
			success: function(data) {
				$(".tab-content").append(
					$( "#tripTabContentTemplate" ).render(data)
				);

				$(".tab-content").show('slow');
			}
		});
	}*/
	
	function loadTrips() {
		// TODO: implement this with just ONE request!
		$('input[name="tripId[]"]').each(function() {
			var tripId = $(this).val();
			var route = jsRoutes.de.htwg.seapal.web.controllers.TripAPI.tripAsJson(tripId);
			route.ajax({
				dataType: "json",
				success: function(data) {
					$(".tab-navigation").append(
						$( "#tripTabNavigationTemplate" ).render(data)
					);
					
					$(".tab-content").append(
							$( "#tripTabContentTemplate" ).render(data)
					);
					
					$(".tab-navigation").show('slow');
					$(".tab-content").show('slow');
					console.log("load: " + tripId);
					loadWaypointsOfTrip(tripId);
				}
			});
		});
	}
	
	function loadWaypointsOfTrip(tripId) {
		console.log(tripId);
		var route = jsRoutes.de.htwg.seapal.web.controllers.WaypointAPI.waypointsAsJson(tripId);
		route.ajax({
			dataType: "json",
			success: function(data) {
				$("#tab-" + tripId).html(
					$("#tripWaypointTabContentTemplate" ).render(data)
				);
			}
		});
		
		setTimeout(function() { loadWaypointsOfTrip(tripId) }, 2000);
	}
	
	function activateTabs() {
		$('a.tabButton').each(function() {
			$(this).click(function (e) {
				e.preventDefault();
				$(this).tab('show');
			});
		});
		
	}
	
});