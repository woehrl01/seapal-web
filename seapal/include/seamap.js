/* seamap.js */

$(document).ready(function() {
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
			marker.setMap(null);
			$('#tooltip_helper').popover('hide');
		}
	});

	$("#map_canvas").append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

	google.maps.event.addListener(map, 'rightclick', function(event) {
		// remove inner style overflow to make the hole contextmenu visible
		$("#map_canvas").css("overflow","visible");
		
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
		
		$('#tooltip_helper').popover({title: getHeadOfMainContextMenu(), html : true, content: getMainContextMenu(), placement: function(){
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
		 return'<div id="contextmenu">'
			+ '<button id="setMarkCmd" type="button" class="btn"><i class="icon-map-marker"></i> Markierung setzen</button>'
			+ '<button id="setRouteCmd" type="button" class="btn"><i class="icon-flag"></i >Route setzen</button>'
			+ '<button id="distanceHereCmd" type="button" class="btn"><i class="icon-resize-full"></i> Abstand von hier</button>'
			+ '<button id="toTargetCmd" type="button" class="btn"><i class="icon-star"></i> Zum Ziel machen</button>'
			+ '<button id="deleteCmd" type="button" class="btn"><i class="icon-remove"></i> Löschen</button></div>';
	}
	
	function getHeadOfMainContextMenu() {
		 return'<div class="controls controls-row"><div class="span6">'
		 	+ '<div class="input-append"><input id="latmini" readonly="readonly" type="text" name="latmini" class="input-mini" /><span class="add-on">la</span></div></div><div class="span6">'
		 	+ '<div class="input-append"><input id="longmini" readonly="readonly" type="text" name="longmini" class="input-mini" /><span class="add-on">lo</span></div></div></div>';
	}

	function setMarkClicked() {
		/*marker.setIcon('http://www.webbyfreebies.com/wp-content/uploads/2009/12/icon_a.png'); */
	}

	function setRouteClicked() {
		
	}	

	function toTargetClicked() {

	}

	function distanceHereClicked() {
		
	}

	function deleteClicked() {
		
	}

	function updateTooltip(latLng){
		var pos = getCanvasXY(latLng);
		
		$('#tooltip_helper').css({top:pos.y + 10, left:pos.x});
		$('#tooltip_helper').popover('show');
		
		$("#latmini").val(toGeoString(latLng.lat(), "N", "S", 2));
		$("#longmini").val(toGeoString(latLng.lng(), "E", "W", 3));
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