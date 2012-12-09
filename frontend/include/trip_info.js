/* boat_info.js */

$(document).ready(function() {
	$('#form').submit(function(event) {
		event.preventDefault();

		$.ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data) {
				$('#myModal').modal('show');
				resetFormData();
			}
		});
	});

	function resetFormData() {
		$('#form').get(0).reset();
	}

});