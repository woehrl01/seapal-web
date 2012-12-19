/* boat_info.js */

$(document).ready(function() {

	loadAllTrips();

	$("#tripListTable tbody").hide();

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-id");
		deleteTrip(id);		
	});

	function deleteBoat(boatId){
		$.ajax({
			type: "POST",
			url: $('#form').attr('action'),
			data: {
					method: "delete",
					id: boatId
				},
			dataType: "json",
			success: function(data) {
				loadAllBoats();
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

	function loadBoat( boatId) {
		$.ajax({
			type: "GET",
			url: $('#form').attr('action'),
			data: {id: boatId},
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				updateAddSaveButton();
				$('#boat_input').show('slow');
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});

	}

	$('body').on('click', 'a.editItemBtn', function(event) {
	        event.preventDefault();
	        var id = $(this).closest('tr').attr("data-id");
	        if(id > 0){
	        	loadBoat(id);
	        }
    });

    $('body').on('click', 'a.deleteItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id > 0){
	        	$('#deletePromptModal').attr("data-id", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

	function loadAllTrips() {
		$.ajax({
			type: "GET",
			url: '../backend/trip_service.php',
			data: null,
			dataType: "json",
			success: function(data) {
				$( "#tripListTable tbody" ).html(
					$( "#tripListTemplate" ).render(data)
				);

				$('#tripListTable').paginateTable({ rowsPerPage: 10, pager: ".tablePager", autoHidePager: false });
				$("#tripListTable tbody").show('slow');
			}
		});
	}
});

