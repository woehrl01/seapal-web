/* boat_info.js */

$(document).ready(function() {

	loadAllBoats();

	var editFieldsVisible = false;
	var editingDisabled = false;

	$('#boat_input').hide();
	$('#onwardButton').hide();
	$("#boatListTable tbody").hide();
	$('#submitBtn').attr("disabled", "disabled");

	$('#form').submit(function(event) {
		event.preventDefault();

		if(editingDisabled){
			displayAsText(false);
			updateAddSaveButton();
		}else{
			jsRoutes.controllers.BoatAPI.addBoat().ajax({
				data: $(this).serialize(),
				dataType: "json",
				success: function(data) {
					if(data.success){
						$('#addSuccessModal').modal('show');
						editFieldsVisible = false;
						$('#boat_input').slideUp('slow').promise().done(resetFormData());
						
						loadAllBoats();
					}else{
						console.log(data.errors);
						alert("Serverside error occured!");
					}
				}
			});
		}		
	});

	$('#addButton').click(function(event){
		event.preventDefault();
		editFieldsVisible = !editFieldsVisible;
		$('#boat_input').slideToggle('slow').promise().done(resetFormData());
	});

	$('#onwardButton').click(function(event){
		event.preventDefault();
		var boatId = $('#idField').val();

		window.location.href = jsRoutes.controllers.Application.trip_list(boatId).url;
	});

	function updateAddSaveButton(){
		var icon = $('#addButton').find('i');

		if (editFieldsVisible){
			icon.removeClass('icon-plus');
			icon.addClass('icon-minus');
			$('#submitBtn').removeAttr("disabled");
			$('#addButton span').html('Abbrechen');
		}else{
			icon.removeClass('icon-minus');
			icon.addClass('icon-plus');
			$('#submitBtn').attr("disabled", "disabled");
			$('#addButton span').html('Hinzufügen');
		}

		if($('#idField').val() > 0){
			if(editingDisabled){
				$('#submitBtn').val("Bearbeiten");
			}else{
				$('#submitBtn').val("Aktualisieren");
			}
			$('#onwardButton').show();
		}else{
			$('#submitBtn').val("Speichern");
			$('#onwardButton').hide();
		}
	}

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-boatid");
		deleteBoat(id);		
	});

	function deleteBoat(boatId){
		jsRoutes.controllers.BoatAPI.deleteBoat(boatId).ajax({
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

	function loadBoat( boatId, displayOnly) {
		jsRoutes.controllers.BoatAPI.boatAsJson(boatId).ajax({
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				editFieldsVisible = true;
				displayAsText(displayOnly);
				$('#boat_input').slideDown('slow').promise().done(updateAddSaveButton());
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});

	}

	function displayAsText(showAsText){
		if(showAsText){
			$("#boat_input input").prop('disabled', true);
			$("#boat_input input").addClass('asText');
			editingDisabled = true;
		}else{
			$("#boat_input input").prop('disabled', false);
			$("#boat_input input").removeClass('asText');
			editingDisabled = false;
		}
	}

	$('body').on('click', 'a.editBoadBtn', function(event) {
	        event.preventDefault();
	        var id = $(this).closest('tr').attr("data-boatid");
	        if(id > 0){
	        	loadBoat(id, false);
	        	displayAsText(false);
	        }
    });

    $('body').on('click', 'a.deleteBoadBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-boatid");

	        if(id > 0){
	        	$('#deletePromptModal').attr("data-boatid", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

    $('body').on('click', 'a.selectBoatBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-boatid");
	        if(id > 0){
	        	window.location.href = jsRoutes.controllers.Application.trip_list(id).url;
	        }
    });

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("-1");
		displayAsText(false);
		updateAddSaveButton();
	}

	function loadAllBoats() {
		jsRoutes.controllers.BoatAPI.boatsAsJson().ajax({
			dataType: "json",
			success: function(data) {
				$( "#boatListTable tbody" ).html(
					$( "#boatListTemplate" ).render(data)
				);
				$('.tooltipable').tooltip();
				$('#boatListTable').paginateTable({ rowsPerPage: 5, pager: ".tablePager", autoHidePager: false });
				$("#boatListTable tbody").show('slow');
			}
		});
	}

	$('body').on('click', '#boatListTable tbody td', function() {
			if(!$(this).hasClass('actionCol')){
				var id = $(this).closest('tr').attr("data-boatid");
	        	loadBoat(id, true);
			}
    });
});

