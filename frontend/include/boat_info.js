/* boat_info.js */

$(document).ready(function() {

	loadAllBoats();

	$('#boat_input').hide();
	$("#boatListTable tbody").hide();

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
					$('#boat_input').hide('slow');
					resetFormData();
					loadAllBoats();
				}else{
					alert("Serverside error occured!");
				}
			}
		});
	});

	$('#addButton').click(function(event){
		event.preventDefault();
		
		var icon = $(this).find('i');
		var area = $('#boat_input');

		if (area.is(':visible')){
			area.hide('slow');
			icon.addClass('icon-plus');
			icon.removeClass('icon-minus');
		}else{
			area.show('slow');
			icon.addClass('icon-minus');
			icon.removeClass('icon-plus');
		}

		resetFormData();
	});

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();
		var id = $('#deletePromptModal .modal-body span').html();
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
			url: "../backend/boat_service.php",
			data: {id: boatId},
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				$('#boat_input').show('slow');

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
	        	$('#deletePromptModal .modal-body span').html(id);
	        	$('#deletePromptModal').modal('show');
	        }
    });

	function resetFormData() {
		$('#form').get(0).reset();
		$('form input[name="id"]').val("-1");
	}

	function loadAllBoats() {
		$.ajax({
			type: "GET",
			url: "../backend/boat_service.php",
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
});

