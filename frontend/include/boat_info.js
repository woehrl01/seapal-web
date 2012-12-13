/* boat_info.js */

$(document).ready(function() {

	loadAllBoats();
	makeTableSelectable();

	$('#form').submit(function(event) {
		event.preventDefault();

		$.ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				$('#addSuccessModal').modal('show');
				resetFormData();
				loadAllBoats();
			}
		});
	});

	$('#deleteBtn').click(function(event){
		event.preventDefault();

		$('#deletePromptModal').modal('show');

	});

	$('#deleteModalBtn').click(function(event) {
		event.preventDefault();

		$('#boatListTable tbody tr.error').each(function(id){ //.first() before .each() if only delete single value

			var row = new Array();
			$(this).find("td").each(function(){
			    row.push($(this).html());
			});
			
			$.ajax({
				type: "POST",
				url: $('#form').attr('action'),
				data: {
						method: "delete",
						id: row[0]
					},
				dataType: "json",
				success: function(data) {
					loadAllBoats();
				}
			});

		});
		
	});

	function resetFormData() {
		$('#form').get(0).reset();
	}

	function loadAllBoats() {
		$.ajax({
			type: "GET",
			url: "/backend/boat_service.php",
			data: null,
			dataType: "json",
			success: function(data) {
				var content = '';
				for(var i = 0; i < data.length; ++i){
		            content += '<tr><td>' + data[i].id + '</td><td>' + data[i].boat_name + '</td></tr>';

		        }
				$('#boatListTable tbody').html(content);
				$('#boatListTable').paginateTable({ rowsPerPage: 5, pager: ".tablePager", autoHidePager: false });
			}
		});
		updateDeleteButton();
	}

	function updateDeleteButton(){
		var count = $('#boatListTable tbody tr.error').size();
		
		if(count > 0){
			$('#deleteBtn').removeAttr("disabled");

		}else{
			$('#deleteBtn').attr("disabled", "disabled");
		}

		var entryText = (count == 1 ? "Eintrag" :"Einträge");
		$('#deletePromptModal .modal-body span').html(count + ' ' + entryText);

	}


	function makeTableSelectable(){
		$('body').on('click', '#boatListTable tbody td', function() {
	        //$(this).closest('tr').siblings().removeClass('success');
	        $(this).parents('tr').toggleClass('error', this.clicked);
	        updateDeleteButton();
    	});
	}
});

