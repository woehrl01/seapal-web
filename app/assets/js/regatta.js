/* regatta.js */

$(document).ready(function() {
	loadAllTrips();
	activateTabs();
	
	$(".tab-content").hide();
	
	function loadAllTrips() {
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