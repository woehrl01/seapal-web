/* boat_info.js */

$(document).ready(function() {

	loadAllBoats();

	var editFieldsVisible = false;

	$('#boat_input').hide();
	$("#boatListTable tbody").hide();
	$('#submitBtn').attr("disabled", "disabled");

	$('#form').submit(function(event) {
		event.preventDefault();

		$.ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				if(data.success){
					$('#addSuccessModal').modal('show');
					editFieldsVisible = false;
					$('#boat_input').hide('slow', resetFormData());
					
					loadAllBoats();
				}else{
					console.log(data.errors);
					alert("Serverside error occured!");
				}
			}
		});
	});

	$('#addButton').click(function(event){
		event.preventDefault();
		editFieldsVisible = !editFieldsVisible;
		$('#boat_input').toggle('slow', resetFormData());
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
			$('#submitBtn').val("Aktualisieren");
		}else{
			$('#submitBtn').val("Speichern");
		}
	}

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal').attr("data-boatid");
		deleteBoat(id);		
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
				editFieldsVisible = true;
				$('#boat_input').show('slow', updateAddSaveButton());
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});

	}

	$('body').on('click', 'a.editBoadBtn', function(event) {
	        event.preventDefault();
	        var id = $(this).closest('tr').attr("data-boatid");
	        if(id > 0){
	        	loadBoat(id);
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

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("-1");
		updateAddSaveButton();
	}

	function loadAllBoats() {
		$.ajax({
			type: "GET",
			url: $('#form').attr('action'),
			data: null,
			dataType: "json",
			success: function(data) {
				$( "#boatListTable tbody" ).html(
					$( "#boatListTemplate" ).render(data)
				);

				$('#boatListTable').paginateTable({ rowsPerPage: 5, pager: ".tablePager", autoHidePager: false });
				$("#boatListTable tbody").show('slow');
			}
		});
	}

	/*$('body').on('click', '#boatListTable tbody td', function() {
	        var id = $(this).closest('tr').attr("data-boatid");
	        window.location.href = 'trip_list.php?boat=' + id;
    });*/
});

