/* boat_info.js */

$(document).ready(function() {

	loadAllTrips();

	$("#tripListTable tbody").hide();

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-id");
		deleteItem(id);		
	});

	function deleteItem(itemId){
		jsRoutes.controllers.TripAPI.deleteTrip(itemId).ajax({
			dataType: "json",
			success: function(data) {
				loadAllTrips();
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

    $('body').on('click', 'a.deleteItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id > 0){
	        	$('#deletePromptModal').attr("data-id", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

    $('body').on('click', 'a.editItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id > 0){
	        	window.location.href = jsRoutes.controllers.Application.trip_edit(id).url;
	        }
    });

	function loadAllTrips() {
		var id = $('#boatId').val();
		var route = jsRoutes.controllers.TripAPI.alltripsAsJson();
		if(id > 0)
			route = jsRoutes.controllers.TripAPI.tripsAsJson(id);

		route.ajax({
			dataType: "json",
			success: function(data) {
				$( "#tripListTable tbody" ).html(
					$( "#tripListTemplate" ).render(data)
				);

				$('.tooltipable').tooltip();
				$('#tripListTable').paginateTable({ rowsPerPage: 10, pager: ".tablePager", autoHidePager: false });
				$("#tripListTable tbody").show('slow');
			}
		});
	}
});

