/* boat_info.js */

$(document).ready(function() {
	
	var tripId = $('#trip_id').val();
	if(tripId != ""){
		loadTrip(tripId);
		loadAllWaypointsByTripId(tripId);
	}

	$("#waypointListTable tbody").hide();

	$('#form').submit(function(event) {
		event.preventDefault();
		var boatId = $('#boat_id').val();

		jsRoutes.de.htwg.seapal.web.controllers.TripAPI.addTrip().ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				if(data.success){
					$('#addSuccessModal').modal('show');
					window.setTimeout(function (){
						window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.trip_list(boatId).url;
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
			jsonObj.push({lat: waypoints[i].latitude, lng : waypoints[i].longitude});
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
				if(tripId != "") {
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
		jsRoutes.de.htwg.seapal.web.controllers.TripAPI.tripAsJson(tripId).ajax({
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				$('#submitBtn').val("Update");
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});
	}

    $('body').on('click', 'a.deleteItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id != ""){
	        	$('#deletePromptModal').attr("data-id", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });
    
    $('body').on('click', 'a.editItemBtn', function(event) {
        event.preventDefault();

        var id = $(this).closest('tr').attr("data-id");
        console.log("id:" + id);
        if(id != ""){
        	window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.waypoint_show(id).url;
        }
	});

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("");
		updateAddSaveButton();
	}

	function loadAllWaypointsByTripId(tripId) {
		jsRoutes.de.htwg.seapal.web.controllers.WaypointAPI.waypointsAsJson(tripId).ajax({
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

