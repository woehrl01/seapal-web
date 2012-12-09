(function( $, window ){
	// default options
	var options = {
		contextMenuContainer : '#map_canvas .menu',
		startLat : 47.655,
		startLong : 9.205,
		height : function() {
			return $(window).height() - $(".header-wrapper .navbar-fixed-top").height() - 20
		}
	};
	
	$.seamap = function(element){	
		var options = $.seamap.options;
	
		// enums
		var States = {
			"NORMAL" : 0, 
			"ROUTE" : 1, 
			"DISTANCE" : 2
		},
		ContextMenuTypes = {
			"DEFAULT" : 0, 
			"DELETE_MARKER" : 1, 
			"DELETE_ROUTEMARKER" : 2
		};
		
		var map = null,
			crosshairMarker = null;

		//boat
		var boatMarker = null;
		
		// route
		var poly = null,
			routeMarkers = new Array();

		// distance
		var distanceLabel = null,
			distancePoly = null,
			distanceMarkers = new Array();

		// editing states
		var state = States.NORMAL;

		// context-menu/selection
		var contextMenuType = ContextMenuTypes.DEFAULT,
			selectedMarker = null,
			contextMenuVisible = false;
	
		// bind our jquery element
		var $this = $(element);
		
		initMap();
		initOpenSeaMaps();
		initContextMenu();

		initPolyline();
		initDistancePolyline();

		updateLatLngInputs();

		positionConnect();

		google.maps.event.addListener(map, 'center_changed', function() {
			updateLatLngInputs();

			if (crosshairMarker != null) {
				updateContextMenu(crosshairMarker.getPosition());
			}
		});

		google.maps.event.addListener(map, 'rightclick', handeMapRightClick);

		google.maps.event.addListener(map, 'click', handeMapClick);
	
		function handeMapClick(event) {
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
		}

		function handeMapRightClick(event) {
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
		}

		/*** initializations ***/
		function initMap() {
			$this.height(options.height());
			$(window).resize(function(){
				$this.height(options.height());
			});
			
			var latlng = new google.maps.LatLng(options.startLat, options.startLong);
			var myOptions = {
				zoom: 14,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			map = new google.maps.Map($this.get(0), myOptions);
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

		function initPolyline() {
			var polyOptions = {
			  strokeColor: '#000000',
			  strokeOpacity: 0.8,
			  strokeWeight: 2
			}
			
			poly = new google.maps.Polyline(polyOptions);
			poly.setMap(map);
		}

		function initDistancePolyline() {
			var polyOptions = {
			  strokeColor: '#550000',
			  strokeOpacity: 0.8,
			  strokeWeight: 2
			}

			distancePoly = new google.maps.Polyline(polyOptions);
			distancePoly.setMap(map);
		}

		function initContextMenu() {
			$this.append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

			$("body").on("click", "#setMarkCmd", setMarkClicked);
			$("body").on("click", "#setRouteCmd", setRouteClicked);
			$("body").on("click", "#distanceHereCmd", distanceHereClicked);
			$("body").on("click", "#toTargetCmd", toTargetClicked);
			$("body").on("click", "#deleteCmd", deleteClicked);
			$("body").on("click", "#exitRouteModeCmd", exitRouteModeClicked);
			$("body").on("click", "#deleteMarkerCmd", deleteMarkerClicked);
			$("body").on("click", "#deleteRouteMarkerCmd", deleteRouteMarkerClicked);
			$("body").on("click", "#deleteDistanceMarkerCmd", deleteDistanceMarkerClicked);
		}

		/*** boat position ***/

		function updateBoatPosition(position){
			if(boatMarker == null){
				var crosshairShape = {coords:[0,0,0,0],type:'rect'};
				var image = new google.maps.MarkerImage('images/boat.png',
				new google.maps.Size(32,32),
				new google.maps.Point(0,0),
				new google.maps.Point(16,16));

				boatMarker = new google.maps.Marker({
					position: position,
					map: map,
					title:"boat",
					shape: crosshairShape,
					icon: image
				});
			}else{
				boatMarker.setPosition(position);
				//console.log(position);
			}

			if ($('#enable_tracing:checked').val() == 'true') {	
				map.panTo(position);
			}

		}

		function positionConnect(){
			$.ajax({
				type: 'GET',
				url : "boatposition.php",
				dataType : 'json',
				data: null,
				success : function(response){

					position = new google.maps.LatLng(response.lat, response.lng);
					updateBoatPosition(position);
					noerror = true;
				},
				complete: function(response){
					if(!self.noerror){
						setTimeout(function(){positionConnect();},5000);
					}else{
						positionConnect();
					}
					noerror = false;
				}
			});
		}


		/*** marker ***/

		function removeMarker(marker) {
			if (marker != null) {
				marker.setMap(null);
			}
		}

		function setDefaultMarker(position) {
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				draggable: true
			});


			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_MARKER, newMarker);
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

		/*** context menu ***/

		function showContextMenu(latLng, type, marker) {
			contextMenuVisible = true;
			contextMenuType = type;
			selectedMarker = marker;
			showContextMenuInternal(latLng);
		}

		function showContextMenuInternal(latLng) {
			$('#tooltip_helper').popover({title: function() {
					var lat = crosshairMarker.getPosition().lat();
					var lng = crosshairMarker.getPosition().lng();

					return '<span><b>Lat</b> ' + toGeoString(lat, "N", "S", 2) + ' <b>Lon</b> ' + toGeoString(lng, "E", "W", 3) + '</span>'
						 + '<span><b>BTM</b> XXX° <b>DTM</b> X.XXXnm</span>';
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
			
			$this.css("overflow","visible"); // bugfix > menu overlaps!
			updateContextMenu(latLng);	
		}

		function hideContextMenu() {
			
			$('#tooltip_helper').popover('hide');
			contextMenuVisible = false;
		}

		function updateContextMenu(latLng){
			if ($('.popover').is(':visible')) {
				var pos = getCanvasXY(latLng);

				var xPos = pos.x;
				var yPos = pos.y + 10;
				var width = $this.width();
				var height = $this.height();

				$('#tooltip_helper').css({top: yPos, left: xPos});

				// check whether the popup is displayed outside of the maps container
				if (xPos > 5 && xPos < width - 5 && yPos > 5 && yPos < height - 5) {
					$('#tooltip_helper').popover('show');
					contextMenuVisible = true;
				} else {
					hideContextMenu();
				}
			}
		}

		function getContextMenuContent() {
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
		}

		/*** context menu events ***/

		function setMarkClicked() {
			setDefaultMarker(crosshairMarker.getPosition())

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			hideContextMenu();
		}

		function setRouteClicked() {
			addRoutePosition(crosshairMarker.getPosition());

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			state = States.ROUTE;

			hideContextMenu();
			displayRouteControls();
		}	

		function toTargetClicked() {
			alert("not implemented");
			crosshairMarker.setVisible(false);
			hideContextMenu();
		}

		function distanceHereClicked() {
			//startDistance(crosshairMarker.getPosition());
			addDistancePosition(crosshairMarker.getPosition());

			// make the crosshair invisible
			crosshairMarker.setVisible(false);

			state = States.DISTANCE;

			hideContextMenu();
		}

		function deleteClicked() {
			alert("not implemented");
			crosshairMarker.setVisible(false);
			hideContextMenu();
		}

		function exitRouteModeClicked () {
			crosshairMarker.setVisible(false);
			state = States.NORMAL;
			hideContextMenu();
		}

		function deleteMarkerClicked () {
			removeMarker(selectedMarker);
			hideContextMenu();
		}

		function deleteRouteMarkerClicked () {
			removeRoutePosition(selectedMarker);
			hideContextMenu();
		}

		function deleteDistanceMarkerClicked () {
			removeDistancePosition(selectedMarker);
			hideContextMenu();
		}

		/*** Lat/Lng ***/

		function updateLatLngInputs() {
			var lat = map.getCenter().lat();
			var lng = map.getCenter().lng();

			$("#lat").val(toGeoString(lat, "N", "S", 2));
			$("#long").val(toGeoString(lng, "E", "W", 3));
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

		function getCanvasXY(currentLatLng){
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
		}

		/*** Routes ***/

		function displayRouteControls() {
			// TODO: bring the route-control into view here!
			// add a button, which switches back to normal state 
			// to exit ROUTE-MODE: "state = States.NORMAL"
		}

		function addRouteMarker(position) {

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
		}

		function addRoutePosition(latLng) {
			addRouteLine(latLng);
			addRouteMarker(latLng);
		}

		function removeRoutePosition(marker) {
			routeMarkers = $.grep(routeMarkers, function(value) {
			  return value != marker;
			});
			
			removeMarker(marker);
			updateRouteLine();
		}

		function addRouteLine(latLng) {
			var path = poly.getPath();
			path.push(latLng);
		}

		function updateRouteLine() {
			var roulersPath = new Array();
			for (var i = 0; i < routeMarkers.length; ++i) {
				roulersPath[i] = routeMarkers[i].getPosition();
			}

			poly.setPath(roulersPath);
		}

		/*** Distance-Roulor ***/

		function addDistancePosition(latLng) {
			addDistanceLine(latLng);
			addDistanceMarker(latLng);

			updateDistanceText();
		}

		function addDistanceMarker(position) {

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
		}

		function removeDistancePosition(marker) {
			distanceMarkers = $.grep(distanceMarkers, function(value) {
			  return value != marker;
			});
			
			removeMarker(marker);
			updateDistanceLine();
		}

		function addDistanceLine(latLng) {
			var path = distancePoly.getPath();
			path.push(latLng);
		}

		function updateDistanceLine() {
			var roulersPath = new Array();
			for (var i = 0; i < distanceMarkers.length; ++i) {
				roulersPath[i] = distanceMarkers[i].getPosition();
			}

			distancePoly.setPath(roulersPath);

			updateDistanceText();
		}

		function updateDistanceText() {
			removeDistanceLabel();

			distanceLabel = new Label({map: map });
			distanceLabel.bindTo('position', distanceMarkers[distanceMarkers.length - 1], 'position');
			distanceLabel.set('text', getTotalDistanceText());
		}

		function endDistance() {
			removeDistanceLabel();

			distancePoly.setPath(new Array());
			for (var i = 0; i < distanceMarkers.length; ++i) {
				distanceMarkers[i].setMap(null);
			}

			state = States.NORMAL;
		}

		function removeDistanceLabel() {
			if (distanceLabel != null) {
				distanceLabel.setMap(null);
			}
		}

		function getTotalDistanceText() {
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
		}

		function distance(lat1,lon1,lat2,lon2) {
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
	
	$.seamap.options = options;

	// extend jquery with our new fancy seamap function
	$.fn.seamap = function( opts ) {
		if( typeof opts === 'object') {
			$.extend(options, opts);
		}
	
		return this.each(function () {
			$this = $(this);
		
			if($this.data('seamap') === undefined) {
				$this.data('seamap:original', $this.clone());
				var seamap = new $.seamap(this);
				$this.data('seamap', seamap);
			} else {
				$.error("Another initialization of the seamap plugin is not possible!");
			}
		});
  
	};

})( jQuery, window );