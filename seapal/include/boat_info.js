/* boat_info.js */

$(document).ready(function() {
	$('#form').submit(function(event) {
		event.preventDefault();
		console.log($(this).attr('action'));


		console.log()

		console.log($(this).serialize());
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