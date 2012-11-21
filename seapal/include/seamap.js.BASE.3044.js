/* seamap.js */

$(document).ready(function() {
	//$('#lat').popover({title: "test", content: "content", placement: "top"});
	//$('#lat').popover('show');
	var marker = null;
	var routeMarkers = new Array();

		var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
  		zoom: 14,
  		center: latlng,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	google.maps.event.addListener(map, 'center_changed', function() {
		var lat = map.getCenter().lat();
		var lng = map.getCenter().lng();

		$("#lat").val(toGeoString(lat, "N", "S", 2));
		$("#long").val(toGeoString(lng, "E", "W", 3));

		if (marker != null) {
			updateTooltip(marker.getPosition());
		}
	});

	

	$("#map_canvas").append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

	google.maps.event.addListener(map, 'rightclick', function(event) {
		var crosshairShape = {coords:[0,0,0,0],type:'rect'};

		if (marker != null) {
			marker.setMap(null);
		}

		var image = new google.maps.MarkerImage(
			'http://www.daftlogic.com/images/cross-hairs.gif',
			new google.maps.Size(19,19),
			new google.maps.Point(0,0),
			new google.maps.Point(8,8));

		marker = new google.maps.Marker({
			position: event.latLng,
			map: map,
			title:"123456",
			shape: crosshairShape,
			icon: image
		});

		var contextMenu = getMainContextMenu();

		$("body").append(contextMenu);

		$('#tooltip_helper').popover({title: "LAT LONG here<br />BTM DTM here", html : true, content: contextMenu, placement: function(){
				var leftDist = $('#tooltip_helper').position().left;
				var width = $('#map_canvas').width();

				return (leftDist > width / 2 ? "left" : "right");
			}
		});

		$("body").on("click", "#setMarkCmd", setMarkClicked);
		$("body").on("click", "#setRouteCmd", setRouteClicked);
		$("body").on("click", "#distanceHereCmd", distanceHereClicked);
		$("body").on("click", "#toTargetCmd", toTargetClicked);
		$("body").on("click", "#deleteCmd", deleteClicked);

		updateTooltip(event.latLng);
		
	});

	function getMainContextMenu() {
		 return'<div>'
			+ '<button id="setMarkCmd" type="button" class="btn">Markierung setzen</button>'
			+ '<button id="setRouteCmd" type="button" class="btn">Route setzen</button>'
			+ '<button id="distanceHereCmd" type="button" class="btn">Abstand von hier</button>'
			+ '<button id="toTargetCmd" type="button" class="btn">Zum Ziel machen</button>'
			+ '<button id="deleteCmd" type="button" class="btn">Löschen</button></div>';
	}

	function setMarkClicked() {
		/*marker.setIcon('http://www.webbyfreebies.com/wp-content/uploads/2009/12/icon_a.png'); */
	}

	function setRouteClicked() {
		
	}	

	function toTargetClicked() {
		;
	}

	function distanceHereClicked() {
		
	}

	function deleteClicked() {
		
	}

	function updateTooltip(latLng){
		var pos = getCanvasXY(latLng);

		$('#tooltip_helper').css({top:pos.y + 10, left:pos.x});
		$('#tooltip_helper').popover('show');
	}

	function toGeoString(value, posChar, negChar, degLength) {
		var direction;

		if (value >= 0) {
			direction = posChar;
			
		} else {
			direction = negChar;
			value = -value;
		}

		var deg = Math.floor(value);
		var min = (value - deg) * 60;
		var min_pre = Math.floor(min);
		return leadingZero(deg, degLength) + "°" + leadingZero(min.toFixed(2), 2) + "'" + direction;
	}

	function leadingZero(num, size) {
		var string = num+"";
		var length = (Math.floor(num) + "").length;
			for (var i = length; i < size; i++) {
				string = "0" + string;
			}

	    return string;
	}

	function getCanvasXY(caurrentLatLng){
    	var scale = Math.pow(2, map.getZoom());
      	var nw = new google.maps.LatLng(
          map.getBounds().getNorthEast().lat(),
          map.getBounds().getSouthWest().lng()
      );
      var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
      var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
      var caurrentLatLngOffset = new google.maps.Point(
          Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
          Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
      );
      return caurrentLatLngOffset;
   }

});