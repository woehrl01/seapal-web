/* seamap.js */

$(document).ready(function() {
	var map = null;
	var crosshairMarker = null;
	var routeMarkers = new Array();

	initMap();
	initOpenSeaMaps();
	initContextMenu();

	updateLatLngInputs();

	google.maps.event.addListener(map, 'center_changed', function() {
		updateLatLngInputs();

		if (crosshairMarker != null) {
			updateContextMenu(crosshairMarker.getPosition());
		}
	});

	google.maps.event.addListener(map, 'rightclick', function(event) {

		removeMarker(crosshairMarker);
		setCrosshairMarker(event.latLng);

		showContextMenu(event.latLng);
	});

	google.maps.event.addListener(map, 'click', function(event) {

		removeMarker(crosshairMarker);
		hideContextMenu();
	});

	function setMarkClicked() {
		setMarker(crosshairMarker.getPosition())

		// make the crosshair invisible
		crosshairMarker.setVisible(false);
	}

	function setRouteClicked() {
		
	}	

	function toTargetClicked() {
		
	}

	function distanceHereClicked() {
		
	}

	function deleteClicked() {
		
	}

	function initMap() {
		var latlng = new google.maps.LatLng(47.655, 9.205);
		var myOptions = {
	  		zoom: 14,
	  		center: latlng,
	  		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	}

	function initOpenSeaMaps() {
		map.overlayMapTypes.push(new google.maps.ImageMapType({
			getTileUrl: function(coord, zoom) {
				return "http://tiles.openseamap.org/seamark/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
			},
			tileSize: new google.maps.Size(256, 256),
			name: "OpenSeaMap",
			maxZoom: 18
		}));
	}

	function updateLatLngInputs() {
		var lat = map.getCenter().lat();
		var lng = map.getCenter().lng();

		$("#lat").val(toGeoString(lat, "N", "S", 2));
		$("#long").val(toGeoString(lng, "E", "W", 3));
	}

	function removeMarker(marker) {
		if (marker != null) {
			marker.setMap(null);
		}
	}

	function setMarker(position) {
		var newMarker = new google.maps.Marker({
			map: map,
			position: position
		});
	}

	function setCrosshairMarker(position) {
		var crosshairShape = {coords:[0,0,0,0],type:'rect'};
		var image = new google.maps.MarkerImage(
			'http://www.daftlogic.com/images/cross-hairs.gif',
			new google.maps.Size(19,19),
			new google.maps.Point(0,0),
			new google.maps.Point(8,8));

		crosshairMarker = new google.maps.Marker({
			position: position,
			map: map,
			title:"crosshair",
			shape: crosshairShape,
			icon: image
		});
	}

	function initContextMenu() {
		$("#map_canvas").append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

		$("body").on("click", "#setMarkCmd", setMarkClicked);
		$("body").on("click", "#setRouteCmd", setRouteClicked);
		$("body").on("click", "#distanceHereCmd", distanceHereClicked);
		$("body").on("click", "#toTargetCmd", toTargetClicked);
		$("body").on("click", "#deleteCmd", deleteClicked);
	}

	function getMainContextMenu() {
		 return'<div>'
			+ '<button id="setMarkCmd" type="button" class="btn ctxButton">Markierung setzen</button>'
			+ '<button id="setRouteCmd" type="button" class="btn ctxButton">Route setzen</button>'
			+ '<button id="distanceHereCmd" type="button" class="btn ctxButton">Abstand von hier</button>'
			+ '<button id="toTargetCmd" type="button" class="btn ctxButton">Zum Ziel machen</button>'
			+ '<button id="deleteCmd" type="button" class="btn ctxButton">Löschen</button></div>';
	}

	function showContextMenu(latLng) {
		var contextMenu = getMainContextMenu();

		$('#tooltip_helper').popover({title: function() {
				var lat = map.getCenter().lat();
				var lng = map.getCenter().lng();

				$("#lat").val(toGeoString(lat, "N", "S", 2));
				$("#long").val(toGeoString(lng, "E", "W", 3));

				return '<span class="ctxTitle">Lat ' + toGeoString(lat, "N", "S", 2) + '  Lon ' + toGeoString(lng, "E", "W", 3) + '</span><br /><span class="ctxTitle">BTM XXX°  DTM X.XXX nm</span>';
			},
			html : true,
			content: contextMenu,
			placement: function(){
				var leftDist = $('#tooltip_helper').position().left;
				var width = $('#map_canvas').width();

				return (leftDist > width / 2 ? "left" : "right");
			}
		});
		$('#tooltip_helper').popover('show');
		updateContextMenu(latLng);
	}

	function hideContextMenu() {
		$('#tooltip_helper').popover('hide');
	}

	function updateContextMenu(latLng){
		if ($('.popover').is(':visible')) {
			var pos = getCanvasXY(latLng);

			var xPos = pos.x;
			var yPos = pos.y + 10;
			var width = $('#map_canvas').width();
			var height = $('#map_canvas').height();

			$('#tooltip_helper').css({top: yPos, left: xPos});

			// check whether the popup is displayed outside of the maps container
			if (xPos > 5 && xPos < width - 5 && yPos > 5 && yPos < height - 5) {
				$('#tooltip_helper').popover('show');
			} else {
				$('#tooltip_helper').popover('hide');
			}
		}
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