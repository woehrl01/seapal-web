/* boat_info.js */

$(document).ready(function() {
	
	var tripId = $('#trip_id').val();
	if(tripId > 0){
		loadTrip(tripId);
		loadAllWaypointsByTripId(tripId);
	}

	$("#waypointListTable tbody").hide();

	$('#form').submit(function(event) {
		event.preventDefault();
		var boatId = $('#boat_id').val();

		jsRoutes.controllers.TripAPI.addTrip().ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				if(data.success){
					$('#addSuccessModal').modal('show');
					window.setTimeout(function (){
						window.location.href = jsRoutes.controllers.Application.trip_list(boatId).url;
					}, 2000);
				} else {
					console.log(data.errors);
					alert("Serverside error occured!");
				}
			}
		});
	});

	$('#addButton').click(function(event){
		event.preventDefault();
		resetFormData();
	});


	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-id");
		deleteWaypoint(id);		
	});

	$('.datepicker').datepicker();

	function initStaticSeamap(waypoints) {
		jsonObj = [];
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

	function deleteWaypoint(waypointId){
		$.ajax({
			type: "POST",
			url: $('#form').attr('action'),
			data: {
					method: "delete",
					id: waypointId
				},
			dataType: "json",
			success: function(data) {
				var tripId = $('#trip_id').val();
				if(tripId > 0) {
					loadAllWaypointsByTripId(tripId);
				}
			}
		});
	}

	function populateJSON( item, data){
		var $inputs = $(item);
		$.each(data, function(key, value) {
		  $inputs.filter(function() {
		    return key == this.name;
		  }).val(value);
		});
	}

	function loadTrip( tripId) {
		jsRoutes.controllers.TripAPI.tripAsJson(tripId).ajax({
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				$('#submitBtn').val("Aktualisieren");
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});

	}

    $('body').on('click', 'a.deleteItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id > 0){
	        	$('#deletePromptModal').attr("data-id", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("-1");
		updateAddSaveButton();
	}

	function loadAllWaypointsByTripId(tripId) {
		jsRoutes.controllers.WaypointAPI.waypointsAsJson(tripId).ajax({
			dataType: "json",
			success: function(data) {
				$( "#waypointListTable tbody" ).html(
					$( "#waypointListTemplate" ).render(data)
				);

				$('.tooltipable').tooltip();
				$('#waypointListTable').paginateTable({ rowsPerPage: 5, pager: ".tablePager", autoHidePager: false });
				$("#waypointListTable tbody").show('slow');

				initStaticSeamap(data);
			}
		});
	}
});

