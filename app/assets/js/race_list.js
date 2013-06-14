/* race_info.js */

$(document).ready(function() {

	loadAllRaces();

	$("#raceListTable tbody").hide();

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-id");
		deleteItem(id);		
	});

	function deleteItem(itemId){
		jsRoutes.de.htwg.seapal.web.controllers.RaceAPI.deleteRace(itemId).ajax({
			dataType: "json",
			success: function(data) {
				loadAllRaces();
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
	        
	        if(id != ""){
	        	$('#deletePromptModal').attr("data-id", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

    $('body').on('click', 'a.editItemBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-id");

	        if(id != ""){
	        	//window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.race_edit(id).url;
	        }
    });

	function loadAllRaces() {
		var route = jsRoutes.de.htwg.seapal.web.controllers.RaceAPI.allRacesAsJson();

		route.ajax({
			dataType: "json",
			success: function(data) {
				$( "#raceListTable tbody" ).html(
					$( "#raceListTemplate" ).render(data)
				);
				
				$('.tooltipable').tooltip();
				$('#raceListTable').paginateTable({ rowsPerPage: 10, pager: ".tablePager", autoHidePager: false });
				$("#raceListTable tbody").show('slow');
			}
		});
	}
});

