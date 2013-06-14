$(document).ready(function() {	
	// lets initialize our fancy racemap on the #map_canvas container.
	
	// interactive:
	$("#map_canvas").racemap({
		height: $(window).height() - $(".header-wrapper .navbar-fixed-top").height() + 21,
		trips : [
			{ lat : 47.665647, lng : 9.184606},
			{ lat : 47.65564, lng : 9.194606},
			{ lat : 47.67564, lng : 9.194606}
		],
		mode : "NOTINTERACTIVE"
	});
});