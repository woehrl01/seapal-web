(function( $, window ){

	var seamap = function(element){
		init : function() {
			initMap();
			initOpenSeaMaps();
			initContextMenu();

			initPolyline();
			initDistancePolyline();

			updateLatLngInputs();

			google.maps.event.addListener(map, 'center_changed', function() {
				updateLatLngInputs();

				if (crosshairMarker != null) {
					updateContextMenu(crosshairMarker.getPosition());
				}
			});

			google.maps.event.addListener(map, 'rightclick', handeMapRightClick);

			google.maps.event.addListener(map, 'click', handeMapClick);
		},		
		
		handeMapClick : function(event) {
			switch(state) {
				case States.NORMAL: 
					removeMarker(crosshairMarker);
					hideContextMenu();
					break;
				case States.ROUTE:
					if (contextMenuVisible) {
						hideContextMenu();
					} else {
						addRoutePosition(event.latLng);
					}
					break;
				case States.DISTANCE:
					if (contextMenuVisible) {
						hideContextMenu();
					} else {
						addDistancePosition(event.latLng);
					}
					break;
			}
		},

		handeMapRightClick : function(event) {
			switch(state) {
				case States.NORMAL: 
					removeMarker(crosshairMarker);
					setCrosshairMarker(event.latLng);

					showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
					break;
				case States.ROUTE:
					removeMarker(crosshairMarker);
					setCrosshairMarker(event.latLng);

					showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
					break;
				case States.DISTANCE:
					endDistance();
					break;
			}
		},

		/*** initializations ***/

		initMap : function() {
			$("#map_canvas").height($(window).height() - $(".header-wrapper .navbar-fixed-top").height() - 20);
			$(window).resize(function(){
				$("#map_canvas").height($(window).height() - $(".header-wrapper .navbar-fixed-top").height() - 20);
			});
			
			var latlng = new google.maps.LatLng(47.655, 9.205);
			var myOptions = {
				zoom: 14,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		},

		initOpenSeaMaps : function() {
			map.overlayMapTypes.push(new google.maps.ImageMapType({
				getTileUrl: function(coord, zoom) {
					return "http://tiles.openseamap.org/seamark/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
				},
				tileSize: new google.maps.Size(256, 256),
				name: "OpenSeaMap",
				maxZoom: 18
			}));
		},

		initPolyline : function() {
			var polyOptions = {
			  strokeColor: '#000000',
			  strokeOpacity: 0.8,
			  strokeWeight: 2
			}
			
			poly = new google.maps.Polyline(polyOptions);
			poly.setMap(map);
		},

		initDistancePolyline : function() {
			var polyOptions = {
			  strokeColor: '#550000',
			  strokeOpacity: 0.8,
			  strokeWeight: 2
			}

			distancePoly = new google.maps.Polyline(polyOptions);
			distancePoly.setMap(map);
		},

		initContextMenu : function() {
			$("#map_canvas").append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

			$("body").on("click", "#setMarkCmd", setMarkClicked);
			$("body").on("click", "#setRouteCmd", setRouteClicked);
			$("body").on("click", "#distanceHereCmd", distanceHereClicked);
			$("body").on("click", "#toTargetCmd", toTargetClicked);
			$("body").on("click", "#deleteCmd", deleteClicked);
			$("body").on("click", "#exitRouteModeCmd", exitRouteModeClicked);
			$("body").on("click", "#deleteMarkerCmd", deleteMarkerClicked);
			$("body").on("click", "#deleteRouteMarkerCmd", deleteRouteMarkerClicked);
			$("body").on("click", "#deleteDistanceMarkerCmd", deleteDistanceMarkerClicked);
		},

		/*** marker ***/

		removeMarker : function(marker) {
			if (marker != null) {
				marker.setMap(null);
			}
		},

		setDefaultMarker : function(position) {
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				draggable: true
			});


			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_MARKER, newMarker);
			});
		},

		setCrosshairMarker : function(position) {
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
		},

		/*** context menu ***/

		showContextMenu : function(latLng, type, marker) {
			contextMenuVisible = true;
			contextMenuType = type;
			selectedMarker = marker;
			showContextMenuInternal(latLng);
		},

		showContextMenuInternal : function(latLng) {
			$('#tooltip_helper').popover({title: function() {
					var lat = crosshairMarker.getPosition().lat();
					var lng = crosshairMarker.getPosition().lng();

					return '<span class="ctxTitle">Lat ' + toGeoString(lat, "N", "S", 2) + '  Lon ' + toGeoString(lng, "E", "W", 3) + '</span><br />'
						 + '<span class="ctxTitle">BTM XXX°  DTM X.XXX nm</span>';
				},
				html : true,
				content: getContextMenuContent,
				placement: function(){
					var leftDist = $('#tooltip_helper').position().left;
					var width = $('#map_canvas').width();

					return (leftDist > width / 2 ? "left" : "right");
				}
			});
			$('#tooltip_helper').popover('show');
			
			$('#map_canvas').css("overflow","visible"); // bugfix > menu overlaps!
			updateContextMenu(latLng);	
		},

		hideContextMenu : function() {
			
			$('#tooltip_helper').popover('hide');
			contextMenuVisible = false;
		},

		updateContextMenu : function(latLng){
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
					contextMenuVisible = true;
				} else {
					hideContextMenu();
				}
			}
		},

		getContextMenuContent : function() {
			var ctx = '<div id="contextmenu">'
			switch(contextMenuType) {
				case ContextMenuTypes.DEFAULT:
					ctx += '<button id="setMarkCmd" type="button" class="btn"><i class="icon-map-marker"></i> Markierung setzen</button>';
					if (state != States.ROUTE) {
						ctx += '<button id="setRouteCmd" type="button" class="btn"><i class="icon-flag"></i> Route beginnen</button>';
					} else {
						ctx += '<button id="exitRouteModeCmd" type="button" class="btn"><i class="icon-flag"></i> Routenaufzeichnung beenden</button>';
					}
					ctx += '<button id="distanceHereCmd" type="button" class="btn"><i class="icon-resize-full"></i> Abstand von hier</button>'
						+ '<button id="toTargetCmd" type="button" class="btn"><i class="icon-star"></i> Zum Ziel machen</button>'
						+ '<button id="deleteCmd" type="button" class="btn"><i class="icon-remove"></i> Löschen</button>'; 
					break;
				case ContextMenuTypes.DELETE_MARKER:
					ctx += '<button id="deleteMarkerCmd" type="button" class="btn"><i class="icon-map-marker"></i> Markierung löschen</button>';
					break;
				case ContextMenuTypes.DELETE_ROUTEMARKER:
					ctx += '<button id="deleteRouteMarkerCmd" type="button" class="btn"><i class="icon-map-marker"></i> Routenpunkt löschen</button>';
					break;
				case ContextMenuTypes.DELETE_DISTANCEMARKER:
					ctx += '<button id="deleteDistanceMarkerCmd" type="button" class="btn"><i class="icon-map-marker"></i> Distanzpunkt löschen</button>';
					break;
			}
			ctx += '</div>'
			return ctx;
		},

		/*** context menu events ***/

		setMarkClicked : function() {
			setDefaultMarker(crosshairMarker.getPosition())

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			hideContextMenu();
		},

		setRouteClicked : function() {
			addRoutePosition(crosshairMarker.getPosition());

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			state = States.ROUTE;

			hideContextMenu();
			displayRouteControls();
		},

		toTargetClicked : function() {
			alert("not implemented");
			crosshairMarker.setVisible(false);
			hideContextMenu();
		},

		distanceHereClicked : function() {
			//startDistance(crosshairMarker.getPosition());
			addDistancePosition(crosshairMarker.getPosition());

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			state = States.DISTANCE;

			hideContextMenu();
		},

		deleteClicked : function() {
			alert("not implemented");
			crosshairMarker.setVisible(false);
			hideContextMenu();
		},

		exitRouteModeClicked : function() {
			crosshairMarker.setVisible(false);
			state = States.NORMAL;
			hideContextMenu();
		},

		deleteMarkerClicked : function() {
			removeMarker(selectedMarker);
			hideContextMenu();
		},

		deleteRouteMarkerClicked : function() {
			removeRoutePosition(selectedMarker);
			hideContextMenu();
		},

		deleteDistanceMarkerClicked : function() {
			removeDistancePosition(selectedMarker);
			hideContextMenu();
		},

		/*** Lat/Lng ***/

		updateLatLngInputs : function() {
			var lat = map.getCenter().lat();
			var lng = map.getCenter().lng();

			$("#lat").val(toGeoString(lat, "N", "S", 2));
			$("#long").val(toGeoString(lng, "E", "W", 3));
		},

		toGeoString : function(value, posChar, negChar, degLength) {
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
		},

		leadingZero : function(num, size) {
			var string = num+"";
			var length = (Math.floor(num) + "").length;
				for (var i = length; i < size; i++) {
					string = "0" + string;
				}

			return string;
		},

		getCanvasXY : function(currentLatLng){
			var scale = Math.pow(2, map.getZoom());
			var nw = new google.maps.LatLng(
			  map.getBounds().getNorthEast().lat(),
			  map.getBounds().getSouthWest().lng()
		  );
		  var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
		  var worldCoordinate = map.getProjection().fromLatLngToPoint(currentLatLng);
		  var currentLatLngOffset = new google.maps.Point(
			  Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
			  Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
		  );
		  return currentLatLngOffset;
		},

		/*** Routes ***/

		displayRouteControls : function() {
			// TODO: bring the route-control into view here!
			// add a button, which switches back to normal state 
			// to exit ROUTE-MODE: "state = States.NORMAL"
		},

		addRouteMarker : function(position) {

			var pinColor = "007569";
			var pinImage = new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png",
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(7, 19));

			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: pinImage,
				draggable: true,
			});

			google.maps.event.addListener(newMarker, 'drag', function() {
				updateRouteLine();
			});

			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_ROUTEMARKER, newMarker);
			});

			var index = routeMarkers.length;
			routeMarkers[index] = newMarker;
		},

		addRoutePosition : function(latLng) {
			addRouteLine(latLng);
			addRouteMarker(latLng);
		},

		removeRoutePosition : function(marker) {
			routeMarkers = $.grep(routeMarkers, function(value) {
			  return value != marker;
			});
			
			removeMarker(marker);
			updateRouteLine();
		},

		addRouteLine : function(latLng) {
			var path = poly.getPath();
			path.push(latLng);
		},

		updateRouteLine : function() {
			var roulersPath = new Array();
			for (var i = 0; i < routeMarkers.length; ++i) {
				roulersPath[i] = routeMarkers[i].getPosition();
			}

			poly.setPath(roulersPath);
		},

		/*** Distance-Roulor ***/

		addDistancePosition : function(latLng) {
			addDistanceLine(latLng);
			addDistanceMarker(latLng);

			updateDistanceText();
		},

		addDistanceMarker : function(position) {

			var pinColor = "007569";
			var pinImage = new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png",
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(7, 19));

			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: pinImage,
				draggable: true,
			});

			google.maps.event.addListener(newMarker, 'drag', function() {
				updateDistanceLine();
			});

			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_DISTANCEMARKER, newMarker);
			});

			var index = distanceMarkers.length;
			distanceMarkers[index] = newMarker;
		},

		removeDistancePosition : function(marker) {
			distanceMarkers = $.grep(distanceMarkers, function(value) {
			  return value != marker;
			});
			
			removeMarker(marker);
			updateDistanceLine();
		},

		addDistanceLine : function(latLng) {
			var path = distancePoly.getPath();
			path.push(latLng);
		},

		updateDistanceLine : function() {
			var roulersPath = new Array();
			for (var i = 0; i < distanceMarkers.length; ++i) {
				roulersPath[i] = distanceMarkers[i].getPosition();
			}

			distancePoly.setPath(roulersPath);

			updateDistanceText();
		},

		updateDistanceText : function() {
			removeDistanceLabel();

			distanceLabel = new Label({map: map });
			distanceLabel.bindTo('position', distanceMarkers[distanceMarkers.length - 1], 'position');
			distanceLabel.set('text', getTotalDistanceText());
		},

		endDistance : function() {
			removeDistanceLabel();

			distancePoly.setPath(new Array());
			for (var i = 0; i < distanceMarkers.length; ++i) {
				distanceMarkers[i].setMap(null);
			}

			state = States.NORMAL;
		},

		removeDistanceLabel : function() {
			if (distanceLabel != null) {
				distanceLabel.setMap(null);
			}
		},

		getTotalDistanceText : function() {
			var dist = 0;

			if (distanceMarkers.length > 1) {
				for (var i = 0; i < distanceMarkers.length - 1; ++i) {
					dist += distance(distanceMarkers[i].getPosition().lat(),
									 distanceMarkers[i].getPosition().lng(),
									 distanceMarkers[i + 1].getPosition().lat(),
									 distanceMarkers[i + 1].getPosition().lng())
				}
			}

			return dist + "m";
		},

		distance : function(lat1,lon1,lat2,lon2) {
			var R = 6371; // km (change this constant to get miles)
			var dLat = (lat2-lat1) * Math.PI / 180;
			var dLon = (lon2-lon1) * Math.PI / 180; 
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
				Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			return Math.round(d*1000); // in meters
		}
	};
	
	var options = {
		// internal variables
		var vars = {
			map : null,
			crosshairMarker : null,

			// route
			poly : null,
			routeMarkers : new Array(),

			// distance
			distanceLabel : null,
			distancePoly : null,
			distanceMarkers : new Array(),

			// editing states
			States : {
				"NORMAL" : 0, 
				"ROUTE" : 1, 
				"DISTANCE" : 2
			},
			state = States.NORMAL,

			// context-menu/selection
			ContextMenuTypes : {
				"DEFAULT" : 0, 
				"DELETE_MARKER" : 1, 
				"DELETE_ROUTEMARKER" : 2
			},
			contextMenuType : ContextMenuTypes.DEFAULT,
			selectedMarker : null,
			contextMenuVisible : false;
		}
	}
	
	// main function
	$.fn.seamap = function( opts ) {
	
		$.extend(options, opts);
	
		// iterates over all matched items and initializes the seamap
		// TODO: needed? Should it be possible?
		return this.each(function () {
			$this = $(this);
			if( $this.data('seamap') ) {
				return $this.data('seamap');
			}
			
			element.data('seamap:original', $this.clone());
			var seamap = new seamap(this);
			element.data('seamap', seamap);
		});
  
	};

})( jQuery, window );