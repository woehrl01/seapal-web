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
			jsRoutes.de.htwg.seapal.web.controllers.BoatAPI.addBoat().ajax({
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

		window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.trip_list(boatId).url;
	});

	function updateAddSaveButton(){
		var icon = $('#addButton').find('i');

		if (editFieldsVisible){
			icon.removeClass('icon-plus');
			icon.addClass('icon-minus');
			$('#submitBtn').removeAttr("disabled");
			$('#addButton span').html('Cancel');
		}else{
			icon.removeClass('icon-minus');
			icon.addClass('icon-plus');
			$('#submitBtn').attr("disabled", "disabled");
			$('#addButton span').html('Add');
		}

		if($('#idField').val() != ""){
			if(editingDisabled){
				$('#submitBtn').val("Edit");
			}else{
				$('#submitBtn').val("Update");
			}
			$('#onwardButton').show();
		}else{
			$('#submitBtn').val("Save");
			$('#onwardButton').hide();
		}
	}

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-boatid");
		deleteBoat(id);		
	});

	function deleteBoat(boatId){
		jsRoutes.de.htwg.seapal.web.controllers.BoatAPI.deleteBoat(boatId).ajax({
			dataType: "json",
			success: function(data) {
				loadAllBoats();
			}
		});
	}

	function populateJSON(item, entity){
		var $inputs = $(item);
		
		// REMARK: No jQuery.each here, because it does not work
		//         because when the object has a "length"-key
		for (var key in entity)
		{
			$inputs.filter(function() {
			    return key == this.name;
			}).val(entity[key]);
		}
	}

	function loadBoat( boatId, displayOnly) {
		jsRoutes.de.htwg.seapal.web.controllers.BoatAPI.boatAsJson(boatId).ajax({
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
	        if(id != ""){
	        	loadBoat(id, false);
	        	displayAsText(false);
	        } else {
	        	console.log("data-boatid not set");
	        }
    });

    $('body').on('click', 'a.deleteBoadBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-boatid");

	        if(id != ""){
	        	$('#deletePromptModal').attr("data-boatid", id);
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

    $('body').on('click', 'a.selectBoatBtn', function(event) {
	        event.preventDefault();

	        var id = $(this).closest('tr').attr("data-boatid");
	        if(id != ""){
	        	window.location.href = jsRoutes.de.htwg.seapal.web.controllers.Application.trip_list(id).url;
	        }
    });

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("");
		displayAsText(false);
		updateAddSaveButton();
	}

	function loadAllBoats() {
		jsRoutes.de.htwg.seapal.web.controllers.BoatAPI.boatsAsJson().ajax({
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

