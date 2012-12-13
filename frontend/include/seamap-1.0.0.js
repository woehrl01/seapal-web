/**
* Seamap JQuery Plugin
*/
(function( $, window ){
	/**
	* *************************************************************************************
	* Default Options
	* *************************************************************************************
	*/
	var options = {
		defaultRoute : null,
		mode : "INTERACTIVE",
		contextMenuContainer : '#map_canvas .menu',
		startLat : 47.655,
		startLong : 9.205,
		zoom : 15,
		height : function() {
			return $(window).height() - $(".header-wrapper .navbar-fixed-top").height() - 20
		},
		routepolyOptions : {
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 3
		},
		distancePolyOptions : {
			strokeColor: '#550000',
			strokeOpacity: 0.8,
			strokeWeight: 2
		},
		routemarker : {
			image : new google.maps.MarkerImage(
				"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png",
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(7, 19))
		},
		distancemarker : {
			image : new google.maps.MarkerImage(
				"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png",
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(7, 19))
		},
		boatmarker : {
			crosshairShape : {
				coords:[0,0,0,0],
				type:'rect'
			},
			image : new google.maps.MarkerImage(
				'images/boat.png', 
				new google.maps.Size(32,32),	
				new google.maps.Point(0,0),	
				new google.maps.Point(16,16))	
		},
		crosshairmarker : {
			crosshairShape : {
				coords:[0,20,20,20],
				type:'rect'
			},
			image : new google.maps.MarkerImage(
				'http://www.daftlogic.com/images/cross-hairs.gif', 
				new google.maps.Size(50,50),	
				new google.maps.Point(0,0),	
				new google.maps.Point(8,8))	
		}
	};
	
	/**
	* *************************************************************************************
	* Seamap class
	* *************************************************************************************
	*/
	$.seamap = function(element){	
		var options = $.seamap.options;
	
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
		
		// maps
		var map = null;

		// crosshair marker
		var crosshairMarker = null;

		// boat marker
		var boatMarker = null;
		
		// routes
		var routeCounter = 1,
			routes = new Array(),
			activeRoute = null;

		// distance
		var distanceroute = null;
		
		// marker
		var markers = new Array();

		// editing states
		var state = States.NORMAL;

		// context-menu/selection
		var contextMenuType = ContextMenuTypes.DEFAULT,
			selectedMarker = null,
			contextMenuVisible = false;
	
		// bind our jquery element
		var $this = $(element);

		init();

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function init() {
			initMap();
			initOpenSeaMaps();
			
			if ( options.mode !== "NOTINTERACTIVE" ) {
				initContextMenu();	
				initGoogleMapsListeners();	
				startBoatAnimation();
			} 
			
			initDefaultRoute();
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function initMap() {
			if(typeof options.height == 'function') {
				$this.height(options.height());
				
				$(window).resize(function(){
					$this.height(options.height());
				});
			} else {
				$this.height(options.height);
			}		
						
			map = new google.maps.Map(element, {
				zoom: options.zoom,
				center: new google.maps.LatLng(options.startLat, options.startLong),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			
			$this.append("<div class='seamapsidebar' style='float:left;width:0%;height:100%;'><div class='seamapsidebar_inner'></div></div>");
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
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

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function initContextMenu() {
			$this.append('<div id="tooltip_helper"></div>');

			$this.on("click", "#addMarker", handleAddMarker);
			$this.on("click", "#deleteMarker", handleDeleteMarker);
			$this.on("click", "#addNewRoute", handleAddNewRoute);
			$this.on("click", "#exitRouteCreation", handleExitRouteCreation);
			$this.on("click", "#addNewDistanceRoute", handleAddNewDistanceRoute);
			$this.on("click", "#hideContextMenu", handleHideContextMenu);
		}
				
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function initGoogleMapsListeners() {
			google.maps.event.addListener(map, 'center_changed', function() {
				/*updateLatLngInputs();
	
				if (crosshairMarker != null) {
					updateContextMenu(crosshairMarker.getPosition());
				}*/
			});
	
			google.maps.event.addListener(map, 'rightclick', function(event) {
				switch(state) {
					case States.NORMAL: 
						hideCrosshairMarker(crosshairMarker);
						setCrosshairMarker(event.latLng);
						break;
						
					case States.ROUTE:
						hideCrosshairMarker(crosshairMarker);
						setCrosshairMarker(event.latLng);
						showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
						break;
						
					case States.DISTANCE:
						handleExitDistanceRouteCreation();
						break;
				}
			});
	
			google.maps.event.addListener(map, 'click', function(event) {
				switch(state) {
					case States.NORMAL: 
						hideCrosshairMarker(crosshairMarker);
						hideContextMenu();
						break;
						
					case States.ROUTE:
						addRouteMarker(event.latLng);
						break;
						
					case States.DISTANCE:
						addRouteMarker(event.latLng);
						break;
				}
			});	
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function initDefaultRoute() {
			if(options.defaultRoute == null) return;
			
			routeId = routeCounter++;
			
			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE", {});	
			activeRoute.setNotInteractive();
			
			$.each(options.defaultRoute, function() {	
				addRouteMarker(new google.maps.LatLng(this.lat, this.lng));	
			});
		}
				
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function startBoatAnimation(){
			$.ajax({
				type: 'GET',
				url : "boatposition.php",
				dataType : 'json',
				data: null,
				success : function(response){
					position = new google.maps.LatLng(response.lat, response.lng);
					handleBoatPosition(position);
					noerror = true;
				},
				complete: function(response){
					if(!self.noerror){
						setTimeout(function(){startBoatAnimation();},5000);
					}else{
						startBoatAnimation();
					}
					noerror = false;
				}
			});
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleBoatPosition(position){
			if(boatMarker == null){
				boatMarker = new google.maps.Marker({
					position: position,
					map: map,
					title:"boat",
					shape: options.boatmarker.crosshairShape,
					icon: options.boatmarker.image
				});
			}else{
				boatMarker.setPosition(position);
			}
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function setCrosshairMarker(position) {
			if(crosshairMarker != null) {
				crosshairMarker.setPosition(position);
				crosshairMarker.setMap(map);
			}else {
				crosshairMarker = new google.maps.Marker({
					position: position,
					map: map,
					title:"crosshair",
					icon: options.crosshairmarker.image
				});
			}		
			
			google.maps.event.addListener(crosshairMarker, 'click', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
			});	
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function hideCrosshairMarker() {
			if (crosshairMarker != null) {
				crosshairMarker.setMap(null);
			}
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function showContextMenu(latLng, type, marker) {
			contextMenuVisible = true;
			contextMenuType = type;
			selectedMarker = marker;
			showContextMenuInternal(latLng);
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function hideContextMenu() {
			$('#tooltip_helper').popover('hide');
			contextMenuVisible = false;
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function showContextMenuInternal(latLng) {
			$('#tooltip_helper').popover({title: function() {
					var lat = crosshairMarker.getPosition().lat();
					var lng = crosshairMarker.getPosition().lng();

					return '<span><b>Lat</b> ' + toGeoString(lat, "N", "S", 2) + ' <b>Lon</b> ' + toGeoString(lng, "E", "W", 3) + '</span>';
						 //+ '<span><b>BTM</b> XXX° <b>DTM</b> X.XXXnm</span>';
				},
				html : true,
				content: getContextMenuContent,
				placement: function(){
					var leftDist = $('#tooltip_helper').position().left;
					var width = $this.width() - $(".seamapsidebar",$this).width();
		
					return (leftDist > width / 2 ? "left" : "right");
				}
			});
			
			$('#tooltip_helper').popover('show');
			
			$this.css("overflow","visible"); // bugfix > menu overlaps!
			
			updateContextMenuPosition(latLng);	
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function updateContextMenuPosition(latLng){
			if ($('.popover').is(':visible')) {
				var pos = getCanvasXY(latLng);

				var xPos = pos.x;
				var yPos = pos.y + 10;
				var width = $this.width() - $(".seamapsidebar",$this).width();
				var height = $this.height();

				$('#tooltip_helper').css({top: yPos, left: xPos + $(".seamapsidebar",$this).width()});

				// check whether the popup is displayed outside of the maps container
				if (xPos > 5 && xPos < width - 5 && yPos > 5 && yPos < height - 5) {
					$('#tooltip_helper').popover('show');
					contextMenuVisible = true;
				} else {
					hideContextMenu();
				}
			}
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function getContextMenuContent() {
			var ctx = '<div id="contextmenu">'
			switch(contextMenuType) {
				case ContextMenuTypes.DEFAULT:
					ctx += '<button id="addMarker" type="button" class="btn"><i class="icon-map-marker"></i> Markierung setzen</button>';
					if (state != States.ROUTE) {
						ctx += '<button id="addNewRoute" type="button" class="btn"><i class="icon-flag"></i> Route beginnen</button>';
					} else {
						ctx += '<button id="exitRouteCreation" type="button" class="btn"><i class="icon-flag"></i> Routenaufzeichnung beenden</button>';
					}
					ctx += '<button id="addNewDistanceRoute" type="button" class="btn"><i class="icon-resize-full"></i> Abstand von hier</button>'
						//+ '<button id="setAsDestination" type="button" class="btn"><i class="icon-star"></i> Zum Ziel machen</button>'
						+ '<button id="hideContextMenu" type="button" class="btn"><i class="icon-remove"></i> Schließen</button>'; 
					break;
				case ContextMenuTypes.DELETE_MARKER:
					ctx += '<button id="deleteMarker" type="button" class="btn"><i class="icon-map-marker"></i> Markierung löschen</button>';
					break;
				case ContextMenuTypes.DELETE_ROUTEMARKER:
					ctx += '<button id="deleteRouteMarker" type="button" class="btn"><i class="icon-map-marker"></i> Routenpunkt löschen</button>';
					break;
				case ContextMenuTypes.DELETE_DISTANCEMARKER:
					ctx += '<button id="deleteDistanceMarker" type="button" class="btn"><i class="icon-map-marker"></i> Distanzpunkt löschen</button>';
					break;
			}
			ctx += '</div>'
			return ctx;
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function showSidebar(heading) {
			$(".seamapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':'20%',width:'80%'});
			$(".seamapsidebar", $this).animate({width:'20%'});
			
			$(".seamapsidebar .seamapsidebar_inner", $this).html('<h4>' + heading + '</h4><div class="seamapalerts"></div>');
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function hideSidebar() {
			$(".seamapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':'0%',width:'100%'});
			$(".seamapsidebar", $this).animate({width:'0%'});
			$(".seamapsidebar .seamapsidebar_inner", $this).html("");
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function appendContentIntoSidebar(content) {			
			$(".seamapsidebar .seamapsidebar_inner", $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function appendContentIntoSidebarElement(content, selector) {	
			$(".seamapsidebar .seamapsidebar_inner " +  selector, $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function clearSidebarElement(selector) {	
			$(".seamapsidebar .seamapsidebar_inner " +  selector, $this).html("");
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/	
		function appendInfoIntoSidebar(content, type) {	
			$(".seamapsidebar .seamapsidebar_inner .seamapalerts", $this)
				.append('<div class="alert alert-' + type + '"><button type="button" class="close" data-dismiss="alert">&times;</button>' + content + '</div>');
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/		
		function handleHideContextMenu() {
			hideContextMenu();
			hideCrosshairMarker();
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleAddNewDistanceRoute() {
			hideContextMenu();
			hideCrosshairMarker();
			
			activeRoute = distanceroute = new $.seamap.route(-1, map, "DISTANCE", {});			
			activeRoute.addMarker(crosshairMarker.getPosition());

			state = States.DISTANCE;
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleExitDistanceRouteCreation() {
			hideContextMenu();
			hideCrosshairMarker();
			
			state = States.NORMAL;
			
			removeDistanceRoute();
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function removeDistanceRoute() {
			distanceroute.removeFromMap();
			distanceroute = null;
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleAddNewRoute() {
			hideContextMenu();
			hideCrosshairMarker();
			
			routeId = routeCounter++;

			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE", {
				deleted : function(route){
					clearSidebarElement("ul");
					
					$.each(route.markers, function(){
						appendContentIntoSidebarElement('<li><a href="#"><b>Marker #' + this.id + '</b><br /> \
							<small>(Lat ' + toGeoString(this.getPosition().lat(), "N", "S", 2) + ' Lon ' + 
							toGeoString(this.getPosition().lng(), "E", "W", 3) + ')</small></a></li>', '.nav');
						});
				}	
			});			

			state = States.ROUTE;
			
			showSidebar("Route Nummer #" + routeId);
			appendInfoIntoSidebar('<h4>Du bist nun im Routenmodus</h4><p><small>Mit einem Klick fügst Du neue \
				Punkte hinzu. Mit einem Rechtsklick auf einen Routenpunkt entfernst Du diesen wieder.</small></p>', 'success');
			appendContentIntoSidebar('<ul class="nav nav-tabs nav-stacked"></ul>');
			
			addRouteMarker(crosshairMarker.getPosition());
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleExitRouteCreation() {
			hideContextMenu();
			hideCrosshairMarker();
			hideSidebar();
			
			state = States.NORMAL;
		}
			
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function addRouteMarker(latLng) {
			hideContextMenu();
			hideCrosshairMarker();
			
			var newmarker = activeRoute.addMarker(latLng);
			activeRoute.drawPath();
			
			if(state == States.ROUTE) {
				appendContentIntoSidebarElement('<li><a href="#"><b>Marker #' + newmarker.id + '</b><br /> \
					<small>(Lat ' + toGeoString(newmarker.getPosition().lat(), "N", "S", 2) + ' Lon ' + 
					toGeoString(newmarker.getPosition().lng(), "E", "W", 3) + ')</small></a></li>', '.nav');
			}
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleAddMarker() {
			hideContextMenu();
			hideCrosshairMarker();
			addDefaultMarker(crosshairMarker.getPosition());
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function handleDeleteMarker() {
			deleteSelectedMarker();
			hideContextMenu();
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function addDefaultMarker(position) {
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				draggable: true
			});

			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_MARKER, newMarker);
			});
			
			markers[markers.length] = newMarker;
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function deleteSelectedMarker() {
			if(selectedMarker != null) {
				selectedMarker.setMap(null);
			}
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
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

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function leadingZero(num, size) {
			var string = num+"";
			var length = (Math.floor(num) + "").length;
				for (var i = length; i < size; i++) {
					string = "0" + string;
				}

			return string;
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
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
	};
	
	/**
	* *************************************************************************************
	* Route class 
	* *************************************************************************************
	*/
	$.seamap.route = function(newrouteid, newgooglemaps, type, callbacks){
		this.id = newrouteid;
		this.googlemaps = newgooglemaps;
		
		this.path = null;
		this.markers = new Array();
		this.label = null;
		this.notinteractive = false;
		
		this.callbacks = {
			deleted : function(route){}	
		};
		
		$.extend(this.callbacks, callbacks);
		
		// internal data
		var options = $.seamap.options;
		var polyoptions, markeroptions;
		
		if(type === "DISTANCE") {
			polyoptions = options.distancePolyOptions;
			markeroptions = options.distancemarker;
		} else {
			polyoptions = options.routepolyOptions;
			markeroptions = options.routemarker;
		}
			
		this.path = new google.maps.Polyline(polyoptions);
		this.path.setMap(this.googlemaps);
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/		
		this.setNotInteractive = function() {
			this.notinteractive = true;
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.addMarker = function(position) {
			var $this = this;

			var marker = new google.maps.Marker({
				map: this.googlemaps,
				position: position,
				icon: markeroptions.image,
				animation: google.maps.Animation.DROP,
				draggable: !this.notinteractive,
				id: this.markers.length 
			});
			
			this.markers[this.markers.length] = marker;
			if(this.label == null) this.addLabel();	else this.updateLabel();

			if(!this.notinteractive) {
				google.maps.event.addListener(marker, 'dragend', function() {
					$this.drawPath();
					$this.updateLabel();
				});
	
				google.maps.event.addListener(marker, 'rightclick', function(event) {
					$this.removeMarker(marker);
					$this.callbacks.deleted($this);
				});
			}
			
			return marker;
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.removeMarker = function($marker) {
			$marker.setMap(null);
			this.markers = $.grep(this.markers, function(marker) {
				return marker != $marker;
			});
			
			var i = 0;
			$.each(this.markers, function(){
				this.id = i++;
			});
			this.drawPath();
			this.updateLabel();
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.addLabel = function() {		
			this.label = new Label({map: this.googlemaps });
			this.label.bindTo('position', this.markers[this.markers.length-1], 'position');
			this.label.set('text', this.getTotalDistanceText());
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.updateLabel = function() {
			if(this.label != null) this.label.setMap(null);
			
			this.addLabel();
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.removeFromMap = function() {
			this.path.setMap(null);
			this.label.setMap(null);
			$.each(this.markers, function() {
				this.setMap(null);
			});
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.drawPath = function() {
			var newPath = new Array();
			for (var i = 0; i < this.markers.length; ++i) {
				newPath[i] = this.markers[i].getPosition();
			}

			this.path.setPath(newPath);
		}
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.getTotalDistanceText = function() {
			var dist = 0;

			if( this.markers.length > 1 ) {
				for( var i = 0; i < this.markers.length - 1; ++i ) {
					dist += this.distance(	this.markers[i].getPosition().lat(),
									 		this.markers[i].getPosition().lng(),
									 		this.markers[i + 1].getPosition().lat(),
									 		this.markers[i + 1].getPosition().lng())
				}
			}

			return dist + "m";
		}

		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.distance = function(lat1,lon1,lat2,lon2) {
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

	// extend jquery with our new fancy seamap plugin
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