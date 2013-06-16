/**
* Seamap JQuery Plugin
* @version ENGLISH
* @author Julian Mueller
*/
(function( $, window ){
	/**
	* *************************************************************************************
	* Default Options
	* *************************************************************************************
	*/
	var options = {
		defaultRoute 	: null,
		mode 			: "INTERACTIVE",
		startLat 		: 47.655,
		startLong 		: 9.205,
		zoom 			: 15,
		
		height : function() {
			return
		},	
		// Stroke colors: [0] is used for the distance tool, [1..] are used for the routes
		strokeColors : ['grey','red','blue','green','yellow','blueviolet','darkorange','magenta','black'],
		
		// Default options for the marker
		defaultOptions : {
			polyOptions : {
				strokeColor: '#000000',
				strokeOpacity: 0.5,
				strokeWeight: 3
			},
			markerOptions : {
				image : new google.maps.MarkerImage(
					"/assets/images/pin_marker.png",
					new google.maps.Size(42, 42),
					new google.maps.Point(0,0),
					new google.maps.Point(21, 36))
			}
		},
		
		// Default options for the routing tool
		routeOptions : {
			polyOptions : {
				strokeColor: '#000000',
				strokeOpacity: 0.5,
				strokeWeight: 3
			},
			markerOptions : {
				image : new google.maps.MarkerImage(
					"/assets/images/circle.png",
					new google.maps.Size(20, 20),
					new google.maps.Point(0,0),
					new google.maps.Point(10, 10))
			}
		},
		
		// Default options for the distance tool
		distanceOptions : {
			polyOptions : {
				strokeColor: '#550000',
				strokeOpacity: 0.5,
				strokeWeight: 2
			},
			markerOptions : {
				image : new google.maps.MarkerImage(
					"/assets/images/circle.png",
					new google.maps.Size(20, 20),
					new google.maps.Point(0,0),
					new google.maps.Point(10, 10))
			}
		},
		
		// Default options for the tracked boat
		boatOptions : {
			markerOptions : {
				crosshairShape : {
					coords:[0,0,0,0],
					type:'rect'
				},
				image : new google.maps.MarkerImage(
					'/assets/images/boat.png', 
					new google.maps.Size(32,32),	
					new google.maps.Point(0,0),	
					new google.maps.Point(16,16))	
			}
		},
		
		// Default options for the crosshair.
		crosshairOptions : {
			markerOptions : {
				crosshairShape : {
					coords:[0,20,20,20],
					type:'rect'
				},
				image : new google.maps.MarkerImage(
					'/assets/images/crosshair.png', 
					new google.maps.Size(28,28),	
					new google.maps.Point(0,0),	
					new google.maps.Point(14,14))	
			}
		}
	};
	
	/**
	* *************************************************************************************
	* The seamap object class
	* *************************************************************************************
	*/
	$.seamap = function(element){	
		var options = $.seamap.options;
	
		// The states of the plugin
		var States = {
			"NORMAL" : 0, 
			"ROUTE" : 1, 
			"DISTANCE" : 2
		},
		// The context menu types
		ContextMenuTypes = {
			"DEFAULT" : 0, 
			"DELETE_MARKER" : 1
		};
		
		// maps
		var map = null;

		// crosshair marker
		var crosshairMarker = null;

		// boat marker
		var boatMarker = null;
		
		// routes
		var routeCounter = 1,
			routes = [],
			activeRoute = null;

		// distance
		var distanceroute = null;
		
		// marker
		var markers = [];

		// editing states
		var state = States.NORMAL;

		// context-menu/selection
		var contextMenuType = ContextMenuTypes.DEFAULT,
			selectedMarker = null,
			contextMenuVisible = false;
	
		// bind our jquery element
		var $this = $(element);
		
		// set as destination path
		var destpath = new google.maps.Polyline(options.polyOptions);

		init();

		/**
		* *********************************************************************************
		* Initializes the GoogleMaps with OpenSeaMaps overlay, the context menu, the
		* boat animation and the default route.
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
			
			initCrosshairMarker();
		}

		/**
		* *********************************************************************************
		* Initialized the GoogleMaps (zoom level, center position, ...)
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
		* Initializes the OpenSeamaps overlay.
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
		* Initializes the context menus.
		* *********************************************************************************
		*/
		function initContextMenu() {
			$this.append('<div id="tooltip_helper"></div>');

			$this.on("click", "#addMarker", handleAddMarker);
			$this.on("click", "#deleteMarker", handleDeleteMarker);
			$this.on("click", "#addNewRoute", handleAddNewRoute);
			$this.on("click", "#exitRouteCreation", handleExitRouteCreation);
			$this.on("click", "#setAsDestination", handleSetAsDestination);
			$this.on("click", "#addNewDistanceRoute", handleAddNewDistanceRoute);
			$this.on("click", "#hideContextMenu", handleHideContextMenu);
		}
				
		/**
		* *********************************************************************************
		* Initializes the GoogleMaps listeners (left/right click, move, ...) and defines
		* the actions in each state of the plugin.
		* *********************************************************************************
		*/
		function initGoogleMapsListeners() {
			// move
			google.maps.event.addListener(map, 'bounds_changed', function() {
				if (crosshairMarker != null && contextMenuVisible) {
					updateContextMenuPosition(crosshairMarker.getPosition());
				}
			});
			// right-click
			google.maps.event.addListener(map, 'rightclick', function(event) {
				switch(state) {
					case States.NORMAL: 
						hideContextMenu();
						hideCrosshairMarker(crosshairMarker);
						showCrosshairMarker(event.latLng);
						break;
						
					case States.ROUTE:
						hideCrosshairMarker(crosshairMarker);
						showCrosshairMarker(event.latLng);
						showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
						break;
						
					case States.DISTANCE:
						handleExitDistanceRouteCreation();
						break;
				}
			});
			// left click
			google.maps.event.addListener(map, 'click', function(event) {
				hideCrosshairMarker(crosshairMarker);
				hideContextMenu();
				
				switch(state) {
					case States.NORMAL:
						// nothing special
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
		* Initializes the default route of the map, if options.defaultRoute was set.
		* *********************************************************************************
		*/
		function initDefaultRoute() {
			if(options.defaultRoute == null) return;
			
			routeId = routeCounter++;
			
			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE");	
			activeRoute.setNotInteractive();
			
			$.each(options.defaultRoute, function() {	
				addRouteMarker(new google.maps.LatLng(this.lat, this.lng));	
			});
		}
		
		/**
		* *********************************************************************************
		* Inits the crosshair marker (as invisible)
		* Note: Only one crosshair can be displayed at the same time.
		* *********************************************************************************
		*/
		function initCrosshairMarker() {
			crosshairMarker = new google.maps.Marker({
				map: map,
				position: null,
				title:"crosshair",
				icon: options.crosshairOptions.markerOptions.image
			});
			
			// init left-click context menu listener
			google.maps.event.addListener(crosshairMarker, 'click', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DEFAULT, crosshairMarker);
			});
			
			hideCrosshairMarker();
		}
				
		/**
		* *********************************************************************************
		* Starts the AJAX calls using long polling to animate the boat on the maps.
		* *********************************************************************************
		*/
		function startBoatAnimation(){
			jsRoutes.de.htwg.seapal.web.controllers.BoatPositionAPI.current().ajax({
				dataType : 'json',
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
		* Handles the boat position update.
		* *********************************************************************************
		*/
		function handleBoatPosition(position){
			if(boatMarker == null){
				boatMarker = new google.maps.Marker({
					position: position,
					map: map,
					title:"boat",
					shape: options.boatOptions.markerOptions.crosshairShape,
					icon:  options.boatOptions.markerOptions.image
				});
			}else{
				boatMarker.setPosition(position);
			}
		}
		
		/**
		* *********************************************************************************
		* Hides the crosshair marker.
		* *********************************************************************************
		*/
		function showCrosshairMarker(position) {
			crosshairMarker.setMap(map);
			crosshairMarker.setPosition(position);
		}
		
		/**
		* *********************************************************************************
		* Hides the crosshair marker.
		* *********************************************************************************
		*/
		function hideCrosshairMarker() {
			if (crosshairMarker != null) {
				crosshairMarker.setMap(null);
			}
		}

		/**
		* *********************************************************************************
		* Display the contxt menu at the given position, with the given type for the
		* selected marker.
		* *********************************************************************************
		*/
		function showContextMenu(latLng, type, marker) {
			contextMenuVisible = true;
			selectedMarker = marker;
			showContextMenuInternal(latLng, type, marker);
		}
		
		/**
		* *********************************************************************************
		* Hides the context menu.
		* *********************************************************************************
		*/
		function hideContextMenu() { 
			//$('#tooltip_helper').popover('hide'); <-- REMARK: this does cause problems!
			
			$('.popover').css({'display':'none'});
			contextMenuVisible = false;
		}

		/**
		* *********************************************************************************
		* Shows the context menu at the given position.
		* *********************************************************************************
		*/
		function showContextMenuInternal(latLng, ctxMenuType, markerToShowOn) {
			contextMenuType = ctxMenuType;

			marker = markerToShowOn;
			$('#tooltip_helper').popover({title: function() {
					var lat = marker.getPosition().lat();
					var lng = marker.getPosition().lng();

					return '<span><b>Lat</b> ' + toGeoString(lat, "N", "S", 2) + ' <b>Lon</b> ' + toGeoString(lng, "E", "W", 3) + '</span>';
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
		* Updates the context menu position.
		* *********************************************************************************
		*/
		function updateContextMenuPosition(latLng){
			var pos = getCanvasXY(latLng);

			var xPos = pos.x;
			var yPos = pos.y + 10;
			var width = $this.width() - $(".seamapsidebar",$this).width();
			var height = $this.height();

			$('#tooltip_helper').css({top: yPos, left: xPos + $(".seamapsidebar",$this).width()});

			// check whether the popup is displayed outside of the maps container
			if (xPos > 5 && xPos < width - 5 && yPos > 5 && yPos < height - 5) {
				$('#tooltip_helper').popover('show');
			} else {
				$('#tooltip_helper').popover('hide');
			}
			
			contextMenuVisible = true;
		}

		/**
		* *********************************************************************************
		* Gets the context menu content buttons, considering the global context menu type
		* *********************************************************************************
		*/
		function getContextMenuContent() {
			var ctx = '<div id="contextmenu">'
			switch(contextMenuType) {
				case ContextMenuTypes.DEFAULT:
					ctx += '<button id="addMarker" type="button" class="btn"><i class="icon-map-marker"></i> Set Mark</button>';
					if (state != States.ROUTE) {
						ctx += '<button id="addNewRoute" type="button" class="btn"><i class="icon-flag"></i> Start new Route</button>';
					} else {
						ctx += '<button id="exitRouteCreation" type="button" class="btn"><i class="icon-flag"></i> Finish Route Recording</button>';
					}
					ctx += '<button id="addNewDistanceRoute" type="button" class="btn"><i class="icon-resize-full"></i> Distance from here</button>'
						+ '<button id="setAsDestination" type="button" class="btn"><i class="icon-star"></i> Set as Target</button>'
						+ '<button id="hideContextMenu" type="button" class="btn"><i class="icon-remove"></i> Close</button>'; 
					break;
				case ContextMenuTypes.DELETE_MARKER:
					ctx += '<button id="deleteMarker" type="button" class="btn"><i class="icon-map-marker"></i> Delete Mark</button>';
					break;
			}
			ctx += '</div>'
			return ctx;
		}
				
		/**
		* *********************************************************************************
		* Display the sidebar with the given heading.
		* *********************************************************************************
		*/	
		function showSidebar(heading) {
			var sidebarWidth = 275;
			$(".seamapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':sidebarWidth,width:$(window).width() - sidebarWidth});
			$(".seamapsidebar", $this).animate({width:sidebarWidth});
			
			$(".seamapsidebar .seamapsidebar_inner", $this).html('<h4>' + heading + '</h4><div class="seamapalerts"></div>');
		}
		
		/**
		* *********************************************************************************
		* Shows the sidevar of the given route.
		* *********************************************************************************
		*/	
		function showSidebarWithRoute(route) {
			showSidebar('Route <span class="badge" style="background-color:' + route.color + ';">#' + route.id + '</span>');
			appendContentIntoSidebar('<ul class="nav nav-tabs nav-stacked"></ul>');
			appendContentIntoSidebar('<div class="buttons_bottom"><div><a class="closeIt btn btn-block" href="#close"> Finish Route Recording</a></div></div>');

			$.each(route.markers, function() {
				appendMarkerIntoSidebar(this);
			});
			
			$this.unbind('click.sidebar');
			$this.on("click.sidebar", ".seamapsidebar a.delete", function(){
				route.removeMarker(route.markers[getParmFromHash($(this).attr("href"), "deleteId")])
			});
			
			$this.on("click.sidebar", ".seamapsidebar a.closeIt", function(){
				handleExitRouteCreation();
			});
		}
		
		/**
		* *********************************************************************************
		* Hides the sidebar.
		* *********************************************************************************
		*/	
		function hideSidebar() {
			$(".seamapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':'0%',width:'100%'});
			$(".seamapsidebar", $this).animate({width:'0%'});
			$(".seamapsidebar .seamapsidebar_inner", $this).html("");
		}
		
		/**
		* *********************************************************************************
		* Appends content into the sidebar.
		* *********************************************************************************
		*/	
		function appendContentIntoSidebar(content) {			
			$(".seamapsidebar .seamapsidebar_inner", $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* Appends content into the sidebar element with the given selector.
		* *********************************************************************************
		*/	
		function appendContentIntoSidebarElement(content, selector) {	
			$(".seamapsidebar .seamapsidebar_inner " +  selector, $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* Deletes the sidebar element with the given selector.
		* *********************************************************************************
		*/	
		function clearSidebarElement(selector) {	
			$(".seamapsidebar .seamapsidebar_inner " +  selector, $this).html("");
		}
		
		/**
		* *********************************************************************************
		* Appends a info notificaion into the sidebar.
		* *********************************************************************************
		*/	
		function appendInfoIntoSidebar(content, type) {	
			$(".seamapsidebar .seamapsidebar_inner .seamapalerts", $this)
				.append('<div class="alert alert-' + type + '"><button type="button" class="close" data-dismiss="alert">&times;</button>' + content + '</div>');
		}
		
		/**
		* *********************************************************************************
		* Appends a marker into the sidebar.
		* *********************************************************************************
		*/	
		function appendMarkerIntoSidebar(marker) {	
			var content = $('<li class="well well-small"><div class="btn-toolbar pull-right" style="margin:0"> \
					<div class="btn-group"><a class="delete btn" href="#page?deleteId='+marker.id+'"><i class="icon-remove"></i></a></div></div> \
					<b>#' + marker.id + '</b> <small>- Lat ' + toGeoString(marker.getPosition().lat(), "N", "S", 2) + ' Lon ' + 
					toGeoString(marker.getPosition().lng(), "E", "W", 3) + '</small></li>');
			appendContentIntoSidebarElement(content, '.nav');
		}

		/**
		* *********************************************************************************
		* Hides the context menu and the crosshair.
		* *********************************************************************************
		*/		
		function handleHideContextMenu() {
			hideContextMenu();
			hideCrosshairMarker();
		}
		
		/**
		* *********************************************************************************
		* Starts the distance tool and hides the context menu and crosshair.
		* *********************************************************************************
		*/
		function handleAddNewDistanceRoute() {
			hideContextMenu();
			hideCrosshairMarker();
			
			activeRoute = distanceroute = new $.seamap.route(-1, map, "DISTANCE");			
			activeRoute.addMarker(crosshairMarker.getPosition());

			state = States.DISTANCE;
		}
		
		/**
		* *********************************************************************************
		* Stops the distance tool and hides the context menu and crosshair.
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
		* Removes the distance route from the map.
		* *********************************************************************************
		*/
		function removeDistanceRoute() {
			if (distanceroute != null) {
				distanceroute.removeFromMap();
				distanceroute = null;
			}
		}
		
		/**
		* *********************************************************************************
		* Handles the creation of a new route, activates it and bind the mouse-events.
		* Also hides the context menu and the marker.
		* *********************************************************************************
		*/
		function handleAddNewRoute() {
			hideContextMenu();
			hideCrosshairMarker();
			
			routeId = routeCounter++;

			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE");		
			
			activate = function() {
				removeDistanceRoute();
				activateRoute(this);
			}
			
			activeRoute.addEventListener("remove", activate);	
			activeRoute.addEventListener("drag", activate);	
			activeRoute.addEventListener("click", activate);
		
			addRouteMarker(crosshairMarker.getPosition());
			activateRoute(activeRoute);
		}
				
		/**
		* *********************************************************************************
		* Activates the route, so that it is also visible in the sidebar.
		* *********************************************************************************
		*/
		function activateRoute(route) {
			hideCrosshairMarker(crosshairMarker);
			hideContextMenu();
			
			state = States.ROUTE;
			showSidebarWithRoute(route);
			activeRoute = route;
				
		}
		
		/**
		* *********************************************************************************
		* Handles the quit of the route creation.
		* Also closes the context menu, sidebar the hides the crosshair.
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
		* Adds a new route marker to the active route.
		* *********************************************************************************
		*/
		function addRouteMarker(latLng) {
			hideContextMenu();
			hideCrosshairMarker();
			
			var newmarker = activeRoute.addMarker(latLng);
			activeRoute.drawPath();
			
			if(state == States.ROUTE) {
				appendMarkerIntoSidebar(newmarker);
			}
		}
		
		/**
		* *********************************************************************************
		* Handler function for adding a new marker to the map.
		* Also hides the context menu and the crosshair.
		* *********************************************************************************
		*/
		function handleAddMarker() {
			hideContextMenu();
			hideCrosshairMarker();
			addDefaultMarker(crosshairMarker.getPosition());
		}

		/**
		* *********************************************************************************
		* Handler function for deleting a marker. Also hides the context menu.
		* *********************************************************************************
		*/
		function handleDeleteMarker() {
			deleteSelectedMarker();
			hideContextMenu();
		}
		
		/**
		* *********************************************************************************
		* Handler function for setting a target.
		* Also closes the context menu and hides the crosshair.
		* *********************************************************************************
		*/
		function handleSetAsDestination() {
			hideContextMenu();
			hideCrosshairMarker();

			destpath.setMap(map);
			destpath.setPath([boatMarker.getPosition(), crosshairMarker.getPosition()]);
		}
		
		/**
		* *********************************************************************************
		* Adds a simple marker to the given position and
		* bind the click-events to open its context menu.
		* *********************************************************************************
		*/
		function addDefaultMarker(position) {
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: options.defaultOptions.markerOptions.image,
				draggable: true
			});

			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.DELETE_MARKER, newMarker);
			});
			
			markers[markers.length] = newMarker;
		}

		/**
		* *********************************************************************************
		* Deletes the selected marker.
		* *********************************************************************************
		*/
		function deleteSelectedMarker() {
			if(selectedMarker != null) {
				selectedMarker.setMap(null);
			}
		}

		/**
		* *********************************************************************************
		* Converts the position to a GEO-String in the Format: XX.XX°XX.XXN/S'
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
		* Converts the number to a string with leading zero.
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
		* Converts the lat/lng-cooridnate to the x/y-value of the canvas.
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
		
		/**
		* *********************************************************************************
		* Gets the hash-parameters. If there is no param, an empty string will be returned.
		* *********************************************************************************
		*/
		function getParmFromHash(url, parm) {
			var re = new RegExp("#.*[?&]" + parm + "=([^&]+)(&|$)");
			var match = url.match(re);
			return(match ? match[1] : "");
		}
	};
	
	/**
	* *************************************************************************************
	* The route object class 
	* *************************************************************************************
	*/
	$.seamap.route = function(newrouteid, newgooglemaps, type){
		this.id = newrouteid;
		this.googlemaps = newgooglemaps;
		this.color = $.seamap.options.strokeColors[this.id % ($.seamap.options.strokeColors.length-1)];
		
		this.path = null;
		this.markers = [];
		this.label = null;
		this.notinteractive = false;
		
		// internal data
		var eventListener = {
			add : [],
			remove : [],
			drag : [],
			click : []
		};
		
		if(type === "DISTANCE") {
			options = $.seamap.options.distanceOptions;
		} else {
			options = $.seamap.options.routeOptions;
		}
		
		// edit color
		options.polyOptions.strokeColor = this.color;
			
		this.path = new google.maps.Polyline(options.polyOptions);
		this.path.setMap(this.googlemaps);
		
		/**
		* *********************************************************************************
		* Sets the route as not interactive.
		* *********************************************************************************
		*/		
		this.setNotInteractive = function() {
			this.notinteractive = true;
		}
		
		/**
		* *********************************************************************************
		* Adds a new route marker to the given position.
		* *********************************************************************************
		*/
		this.addMarker = function(position) {
			var $this = this;

			// create marker
			var marker = new google.maps.Marker({
				map: this.googlemaps,
				position: position,
				icon: options.markerOptions.image,
				shadow: options.markerOptions.shadow,
				animation: google.maps.Animation.DROP,
				draggable: !this.notinteractive,
				id: this.markers.length 
			});
			this.markers[this.markers.length] = marker;
			
			// adds or updates the label
			if(this.label == null) {
				if (!this.notinteractive) {
					this.addLabel();
				}
			} else {
				this.updateLabel();
			}

			// Add event listeners for the interactive mode
			if(!this.notinteractive) {
				google.maps.event.addListener(marker, 'drag', function() {
					$this.drawPath();
					$this.updateLabel();
					$this.notify("drag");
				});
	
				google.maps.event.addListener(marker, 'rightclick', function(event) {
					$this.removeMarker(marker);
					$this.notify("remove");
				});
				
				google.maps.event.addListener(marker, 'click', function(event) {
					$this.notify("click");
				});
			}
			
			this.notify("add");
			
			return marker;
		}
		
		/**
		* *********************************************************************************
		* Removes a marker from the route.
		* *********************************************************************************
		*/
		this.removeMarker = function($marker) {
			$marker.setMap(null);
			this.markers = $.grep(this.markers, function(mark) {
				return mark != $marker;
			});
			
			var i = 0;
			$.each(this.markers, function(){
				this.id = i++;
			});
			this.drawPath();
			this.updateLabel();
			
			this.notify("remove");
		}
		
		/**
		* *********************************************************************************
		* Adds a label to the last marker.
		* *********************************************************************************
		*/
		this.addLabel = function() {		
			this.label = new Label({map: this.googlemaps });
			this.label.bindTo('position', this.markers[this.markers.length-1], 'position');
			$(this.label.span_).css({"margin-left":"15px","padding":"7px","box-shadow":"0px 0px 3px #666","z-index":99999,"color":this.color});
			this.label.set('text', this.getTotalDistanceText());
		}
		
		/**
		* *********************************************************************************
		* Updates the the label (removes the old and adds a new one).
		* *********************************************************************************
		*/
		this.updateLabel = function() {
			if(this.label != null) this.label.setMap(null);
			if(this.markers.length != 0) this.addLabel();
		}
		
		/**
		* *********************************************************************************
		* Removes a whole route from the map (with its paths, labels and markers).
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
		* Draws a route by conntecting all route markers in the given order.
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
		* Gets the total distance text of the route. Format example: 1234m
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
		* Calculates the distance in meters between two GEO-coordinates (lat/lng).
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
		
		/**
		* *********************************************************************************
		* Adds an event listener with the given type and function.
		* *********************************************************************************
		*/
		this.addEventListener = function(type, fn) {
			eventListener[type][ eventListener[type].length ] = fn;
		}
				
		/**
		* *********************************************************************************
		* Calls the event listener functions, to notify the observers.
		* *********************************************************************************
		*/
		this.notify = function(type) {
			var that = this;
			$.each(eventListener[type], function(){
				this.call(that, 0);
			});
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