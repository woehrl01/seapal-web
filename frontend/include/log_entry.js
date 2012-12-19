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
				if(data.success){
					$('#addSuccessModal').modal('show');
					resetFormData();
				}else{
					console.log(data.errors);
					alert("Serverside error occured!");
				}
			}
		});
	});

	function populateJSON( item, data){
		var $inputs = $(item);
		$.each(data, function(key, value) {
		  $inputs.filter(function() {
		    return key == this.name;
		  }).val(value);
		});
	}

	function loadWaypoint( boatId) {
		$.ajax({
			type: "GET",
			url: $('#form').attr('action'),
			data: {id: boatId},
			dataType: "json",
			success: function(boat) {
				populateJSON('#form input', boat);
				$('html, body').animate({ scrollTop: 0 }, 600);
			}
		});
	}

	function resetFormData() {
		$('#form').get(0).reset();
		$('#idField').val("-1");
	}
});

