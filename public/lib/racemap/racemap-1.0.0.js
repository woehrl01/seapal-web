/**
* Racemap JQuery Plugin
* @version 1.0.0 ENGLISH
* @author Benjamin Sautermeister
*/
(function( $, window ){
	/**
	* *************************************************************************************
	* Default Options
	* *************************************************************************************
	*/
	var options = {
		raceData 	: null,
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
	 * ########################################################################################################
	 * #########################################   RACE MAP   #################################################
	 * ########################################################################################################
	 */
	
	/**
	* *************************************************************************************
	* The racemap object class
	* *************************************************************************************
	*/
	$.racemap = function(element){	
		var options = $.racemap.options; 
		
		/* race additional data */
		// controlPoints (before called markers)
		var controlPoints = [];
		
		var startMarkers = [];
		var startPath = null;

		var goalMarkers = [];
		var goalPath = null;	
		
		var activeWaypoint = null;
		
		// The states of the plugin
		var States = {
			"NORMAL"      : 0, 
			"START"       : 1,
			"GOAL"        : 2,
			"DISTANCE"    : 3,
			"MARKPASSING" : 4
		},
		// The context menu types
		ContextMenuTypes = {
			"DEFAULT"           : 0, 
			"CONTROL_POINT"     : 1, 
			"ROUTE_POINTMARKER" : 2
		};
		
		// maps
		var map = null;

		// crosshair marker
		var crosshairMarker = null;
		
		// routes
		var routeCounter = 1,
			routes = [],
			activeRoute = null;

		// distance
		var distanceroute = null;

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
		* Initializes the GoogleMaps with OpenSeaMaps overlay,
		* the context menu and the default route.
		* *********************************************************************************
		*/
		function init() {
			initMap();
			initOpenSeaMaps();
			
			initContextMenu();	
			initGoogleMapsListeners();
			
			initRace();
			
			initStartPath();
			initGoalPath();
			
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
			
			$this.append("<div class='racemapsidebar' style='float:left;width:0%;height:100%;'><div class='racemapsidebar_inner'></div></div>");
		}

		/**
		* *********************************************************************************
		* Initializes the OpenSeamaps overlay.
		* *********************************************************************************
		*/
		function initOpenSeaMaps() {
			map.overlayMapTypes.push(new google.maps.ImageMapType({
				getTileUrl: function(coord, zoom) {
					return "http://tiles.openracemap.org/seamark/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
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

			$this.on("click", "#addStart", handleAddStart);
			$this.on("click", "#addGoal", handleAddGoal);
			$this.on("click", "#addControlPoint", handleAddControlPoint);
			$this.on("click", "#deleteMarker", handleDeleteControlPoint);
			$this.on("click", "#addNewDistanceRoute", handleAddNewDistanceRoute);
			$this.on("click", "#hideContextMenu", handleHideContextMenu);
			
			$this.on("click", "#showRouteMarkerInfo", handleShowRouteMarkerInfo);
			$this.on("click", "#assignMarkPassing", handleAssignMarkPassing);
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
						
					case States.DISTANCE:
						handleExitDistanceRouteCreation();
						break;
						
					case States.START:
						removeStartFromMap();
						state = States.NORMAL;
						break;
						
					case States.GOAL:
						removeGoalFromMap();
						state = States.NORMAL;
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
						
					case States.DISTANCE:
						addDistanceRouteMarker(event.latLng);
						break;
						
					case States.START:
						addStartMarker(event.latLng);
						break;
						
					case States.GOAL:
						addGoalMarker(event.latLng);
						break;
				}
			});	
		}
		
		/**
		* *********************************************************************************
		* Initializes the race with the given trips and waypoints of the race.
		* *********************************************************************************
		*/
		function initRace() {
			if(options.raceData == null
			   || options.raceData.trips.length == 0) {
				return;
			}
			for (var i = 0; i < options.raceData.trips.length; ++i) {
				routeId = routeCounter++;
				
				activeRoute = routes[routeId] = new $.racemap.route(routeId, map, "ROUTE");	
				activeRoute.setNotInteractive();
				
				activate = function() {
					removeDistanceRoute();
					activateRoute(this);
				}
				
				rightClicked = function(clickedRaceDataEntity) {
					showContextMenu(
						clickedRaceDataEntity.marker.getPosition(),
						ContextMenuTypes.ROUTE_POINTMARKER,
						clickedRaceDataEntity.marker);
					activeWaypoint = clickedRaceDataEntity.waypoint;
					activeRoute = this;
				}
				
				activeRoute.addEventListener("click", activate);
				activeRoute.addEventListener("rightclick", rightClicked);
				
				$.each(options.raceData.trips[i].waypoints, function() {	
					addRouteMarker(this);	
				});
			}
		}
		
		/**
		* *********************************************************************************
		* Initializes the start line path.
		* *********************************************************************************
		*/
		function initStartPath() {
			startPath = new google.maps.Polyline(options.defaultOptions.polyOptions);
			startPath.setMap(map);
		}
		
		/**
		* *********************************************************************************
		* Initializes the goal line path.
		* *********************************************************************************
		*/
		function initGoalPath() {
			goalPath = new google.maps.Polyline(options.defaultOptions.polyOptions);
			goalPath.setMap(map);
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
		* Activates the route, so that it is also visible in the sidebar.
		* *********************************************************************************
		*/
		function activateRoute(route) {
			hideCrosshairMarker(crosshairMarker);
			hideContextMenu();
			showSidebarWithRoute(route);
			activeRoute = route;
			state = States.NORMAL;
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
			crosshairMarker.setPosition(latLng);
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
			$('#tooltip_helper').popover({
				title: function() {
					var lat = marker.getPosition().lat();
					var lng = marker.getPosition().lng();

					return '<span><b>Lat</b> ' + toGeoString(lat, "N", "S", 2) + ' <b>Lon</b> ' + toGeoString(lng, "E", "W", 3) + '</span>';
				},
				html : true,
				content: getContextMenuContent,
				placement: function(){
					var leftDist = $('#tooltip_helper').position().left;
					var width = $this.width() - $(".racemapsidebar",$this).width();
		
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
			var width = $this.width() - $(".racemapsidebar",$this).width();
			var height = $this.height();

			$('#tooltip_helper').css({top: yPos, left: xPos + $(".racemapsidebar",$this).width()});

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
					ctx += '<button id="addStart" type="button" class="btn"><i class="icon-map-marker"></i> Define Start</button>';
					ctx += '<button id="addGoal" type="button" class="btn"><i class="icon-star"></i> Define Goal</button>';
					ctx += '<button id="addControlPoint" type="button" class="btn"><i class="icon-star"></i> Set Control Point</button>';
					ctx += '<button id="addNewDistanceRoute" type="button" class="btn"><i class="icon-resize-full"></i> Distance from here</button>'
						+ '<button id="hideContextMenu" type="button" class="btn"><i class="icon-remove"></i> Close</button>'; 
					break;
				case ContextMenuTypes.CONTROL_POINT:
					ctx += '<button id="deleteMarker" type="button" class="btn"><i class="icon-map-marker"></i> Delete Control Point</button>';
					break;
				case ContextMenuTypes.ROUTE_POINTMARKER:
					ctx += '<button id="showRouteMarkerInfo" type="button" class="btn"><i class="icon-map-marker"></i> Show Route Point Info</button>';
					ctx += '<button id="assignMarkPassing" type="button" class="btn"><i class="icon-map-marker"></i> Assign Mark Passing</button>';
					break;
			}
			ctx += '</div>'
			return ctx;
		}
		
		/**
		 * ####################################################################################################
		 * ############################   SIDEBAR   ###########################################################
		 * ####################################################################################################
		 */
				
		/**
		* *********************************************************************************
		* Display the sidebar with the given heading and optional Subheading.
		* *********************************************************************************
		*/
		function showSidebar(heading, subheading) {
			var sidebarWidth = 275;
			$(".racemapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':sidebarWidth,width:$(window).width() - sidebarWidth});
			$(".racemapsidebar", $this).animate({width:sidebarWidth});
			
			$(".racemapsidebar .racemapsidebar_inner", $this).html('<h4>' + heading + '</h4><h5>' + subheading + '</h5><div class="racemapalerts"></div>');
		}
		
		/**
		* *********************************************************************************
		* Shows the sidebar of the given route.
		* *********************************************************************************
		*/	
		function showSidebarWithRoute(route) {
			var currentTrip = options.raceData.trips[route.id - 1];
			
			showSidebar(
					'Trip: <span class="badge" style="background-color:' + route.color + ';font-size: 14px">' + currentTrip.name + '</span>',
					'Boat: ' + currentTrip.boat.name + '</span></br>' +
					'IOC Code: ' + '###CODE###' + '</span></br>' +
					'Tracked Distance: ' + route.getTotalDistanceText() + '</span>');
			appendContentIntoSidebar('<ul class="nav nav-tabs nav-stacked"></ul>');
			appendContentIntoSidebar('<div class="buttons_bottom"><div><a class="closeIt btn btn-block" href="#close"> Close</a></div></div>');
			
			$.each(route.routeData, function() {
				appendMarkerIntoSidebar(this);
			});
			
			$this.unbind('click.sidebar');
			
			$this.on("click.sidebar", ".racemapsidebar a.closeIt", function(){
				hideSidebar();
			});
		}
		
		/**
		* *********************************************************************************
		* Shows the sidebar of the given waypoint.
		* *********************************************************************************
		*/	
		function showSidebarWithWaypoint(route, waypoint) {
			var currentTrip = options.raceData.trips[route.id - 1];

			showSidebar(
					'Waypoint Info <span class="badge" style="background-color:' + route.color + ';font-size: 14px">' + '#123' + '</span>',
					'Lat: ' + waypoint.coord.lat + '</span></br>' +
					'Lng: ' + waypoint.coord.lng + '</span></br>' +
					'SOG: ' + waypoint.sog + '</span></br>' +
					'COG: ' + waypoint.cog + '</span></br>' +
					'DTM: ' + waypoint.dtm + '</span></br>' +
					'BTM: ' + waypoint.btm + '</span></br>' +
					'Timestamp: ' + waypoint.timestamp + '</span></br>' +
					'Mark passing: ' + ((waypoint.passingMark == null)? 'NO' : 'YES') + '</span>');
			appendContentIntoSidebar('<ul class="nav nav-tabs nav-stacked"></ul>');
			appendContentIntoSidebar('<div class="buttons_bottom"><div><a class="closeIt btn btn-block" href="#close"> Close</a></div></div>');
			
			$this.unbind('click.sidebar');
			
			$this.on("click.sidebar", ".racemapsidebar a.closeIt", function(){
				hideSidebar();
			});
		}
		
		/**
		* *********************************************************************************
		* Hides the sidebar.
		* *********************************************************************************
		*/	
		function hideSidebar() {
			$(".racemapsidebar").siblings("div:not(#tooltip_helper,.popover)").animate({'margin-left':'0%',width:'100%'});
			$(".racemapsidebar", $this).animate({width:'0%'});
			$(".racemapsidebar .racemapsidebar_inner", $this).html("");
		}
		
		/**
		* *********************************************************************************
		* Appends content into the sidebar.
		* *********************************************************************************
		*/	
		function appendContentIntoSidebar(content) {			
			$(".racemapsidebar .racemapsidebar_inner", $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* Appends content into the sidebar element with the given selector.
		* *********************************************************************************
		*/	
		function appendContentIntoSidebarElement(content, selector) {	
			$(".racemapsidebar .racemapsidebar_inner " +  selector, $this).append(content);
		}
		
		/**
		* *********************************************************************************
		* Deletes the sidebar element with the given selector.
		* *********************************************************************************
		*/	
		function clearSidebarElement(selector) {	
			$(".racemapsidebar .racemapsidebar_inner " +  selector, $this).html("");
		}
		
		/**
		* *********************************************************************************
		* Appends a info notificaion into the sidebar.
		* *********************************************************************************
		*/	
		function appendInfoIntoSidebar(content, type) {	
			$(".racemapsidebar .racemapsidebar_inner .racemapalerts", $this)
				.append('<div class="alert alert-' + type + '"><button type="button" class="close" data-dismiss="alert">&times;</button>' + content + '</div>');
		}
		
		/**
		* *********************************************************************************
		* Appends a marker into the sidebar.
		* *********************************************************************************
		*/	
		function appendMarkerIntoSidebar(routeDataEntity) {	
			var content = $('<li class="well well-small"><div class="btn-toolbar pull-right" style="margin:0"> \
					<div class="btn-group"></div></div> \
					<b>#' + routeDataEntity.marker.id + '</b> <small>- Lat ' + toGeoString(routeDataEntity.marker.getPosition().lat(), "N", "S", 2) + ' Lon ' + 
					toGeoString(routeDataEntity.marker.getPosition().lng(), "E", "W", 3) + '</small></li>');
			appendContentIntoSidebarElement(content, '.nav');
		}
		
		/**
		 * ####################################################################################################
		 * #############################   HANDLER FUNCTIONS   ################################################
		 * ####################################################################################################
		 */

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
			
			activeRoute = distanceroute = new $.racemap.route(-1, map, "DISTANCE");			
			activeRoute.addDistanceMarker(crosshairMarker.getPosition());

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
		* Shows the selected route marker in the sidebar.
		* *********************************************************************************
		*/
		function handleShowRouteMarkerInfo() {
			hideContextMenu();
			showSidebarWithWaypoint(activeRoute, activeWaypoint);
		}
		
		/**
		* *********************************************************************************
		* Starts assigning the selected route point to a next clicked controlPoint.
		* *********************************************************************************
		*/
		function handleAssignMarkPassing() {
			hideContextMenu();
			alert('not implemented');
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
		* Adds a new route marker to the active route.
		* *********************************************************************************
		*/
		function addRouteMarker(waypoint) {
			hideContextMenu();
			hideCrosshairMarker();
			
			var newmarker = activeRoute.addWaypoint(waypoint);
			activeRoute.drawPath();
		}
		
		/**
		* *********************************************************************************
		* Adds a new distance route marker to the active route.
		* *********************************************************************************
		*/
		function addDistanceRouteMarker(waypoint) {
			hideContextMenu();
			hideCrosshairMarker();
			
			var newmarker = activeRoute.addDistanceMarker(waypoint);
			activeRoute.drawPath();
		}
		
		/**
		* *********************************************************************************
		* Handler function for adding a new controlPoint to the map.
		* Also hides the context menu and the crosshair.
		* *********************************************************************************
		*/
		function handleAddControlPoint() {
			hideContextMenu();
			hideCrosshairMarker();
			addControlPoint(crosshairMarker.getPosition());
		}

		/**
		* *********************************************************************************
		* Handler function for deleting a marker. Also hides the context menu.
		* *********************************************************************************
		*/
		function handleDeleteControlPoint() {
			deleteSelectedMarker();
			hideContextMenu();
		}
		
		/**
		* *********************************************************************************
		* Adds a simple marker to the given position and
		* bind the click-events to open its context menu.
		* *********************************************************************************
		*/
		function addControlPoint(position) {
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: options.defaultOptions.markerOptions.image,
				draggable: true
			});
			
			google.maps.event.addListener(newMarker, 'click', function() {
				hideCrosshairMarker(crosshairMarker);
				hideContextMenu();
			});

			google.maps.event.addListener(newMarker, 'rightclick', function(event) {
				showContextMenu(event.latLng, ContextMenuTypes.CONTROL_POINT, newMarker);
			});
			
			controlPoints[controlPoints.length] = newMarker;
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
		* Handler function for defining a new start to the map.
		* Also hides the context menu and the crosshair.
		* *********************************************************************************
		*/
		function handleAddStart() {
			hideContextMenu();
			hideCrosshairMarker();
			addStartMarker(crosshairMarker.getPosition());
		}
		
		/**
		* *********************************************************************************
		* Adds a start marker to the given position and
		* bind the click-events to open its context menu.
		* *********************************************************************************
		*/
		function addStartMarker(position) {
			if (startMarkers.length == 2) {
				removeStartFromMap();
			}
			
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: options.defaultOptions.markerOptions.image,
				draggable: true
			});
			
			google.maps.event.addListener(newMarker, 'click', function() {
				hideCrosshairMarker(crosshairMarker);
				hideContextMenu();
			});
			
			google.maps.event.addListener(newMarker, 'drag', function() {
				updateStartLine();
			});
			
			startMarkers[startMarkers.length] = newMarker;
			
			if (startMarkers.length < 2) {
				state = States.START;
			} else {
				state = States.NORMAL;
			}
			
			updateStartLine();
		}
		
		/**
		* *********************************************************************************
		* Removes the start line from the map.
		* *********************************************************************************
		*/
		function removeStartFromMap() {
			startPath.setMap(null);
			$.each(startMarkers, function() {
				this.setMap(null);
			});
			startMarkers = [];
			
			updateStartLine();
		}
		
		/**
		* *********************************************************************************
		* Updates the start line path.
		* *********************************************************************************
		*/
		function updateStartLine(position) {
			var newPath = new Array();
			if (startMarkers.length == 2) {
				startPath.setMap(null);
				initStartPath();
				for (var i = 0; i < startMarkers.length; ++i) {
					newPath[i] = startMarkers[i].getPosition();
				}
				startPath.setPath(newPath);
			}
		}
		
		/**
		* *********************************************************************************
		* Handler function for defining a new goal to the map.
		* Also hides the context menu and the crosshair.
		* *********************************************************************************
		*/
		function handleAddGoal() {
			hideContextMenu();
			hideCrosshairMarker();
			addGoalMarker(crosshairMarker.getPosition());
		}
		
		/**
		* *********************************************************************************
		* Adds a goal marker to the given position and
		* bind the click-events to open its context menu.
		* *********************************************************************************
		*/
		function addGoalMarker(position) {
			if (goalMarkers.length == 2) {
				removeGoalFromMap();
			}
			
			var newMarker = new google.maps.Marker({
				map: map,
				position: position,
				icon: options.defaultOptions.markerOptions.image,
				draggable: true
			});
			
			google.maps.event.addListener(newMarker, 'click', function() {
				hideCrosshairMarker(crosshairMarker);
				hideContextMenu();
			});
			
			google.maps.event.addListener(newMarker, 'drag', function() {
				updateGoalLine();
			});
			
			goalMarkers[goalMarkers.length] = newMarker;
			
			if (goalMarkers.length < 2) {
				state = States.GOAL;
			} else {
				state = States.NORMAL;
			}
			
			updateGoalLine();
		}
		
		/**
		* *********************************************************************************
		* Removes the goal line from the map.
		* *********************************************************************************
		*/
		function removeGoalFromMap() {
			goalPath.setMap(null);
			$.each(goalMarkers, function() {
				this.setMap(null);
			});
			goalMarkers = [];
			
			updateGoalLine();
		}
		
		/**
		* *********************************************************************************
		* Updates the goal line path.
		* *********************************************************************************
		*/
		function updateGoalLine(position) {
			var newPath = new Array();
			if (goalMarkers.length == 2) {
				goalPath.setMap(null);
				initGoalPath();
				for (var i = 0; i < goalMarkers.length; ++i) {
					newPath[i] = goalMarkers[i].getPosition();
				}
				goalPath.setPath(newPath);
			}
		}
		
		/**
		 * ###################################################################################################
		 * ######################################   UTIL FUNCTIONS   #########################################
		 * ###################################################################################################
		 */

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
		
		/**
		 * *********************************************************************************
		 * Creates a random and unique UUID.
		 * *********************************************************************************
		 */
		function createUUID() {
		    // http://www.ietf.org/rfc/rfc4122.txt
		    var s = [];
		    var hexDigits = "0123456789abcdef";
		    for (var i = 0; i < 36; i++) {
		        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		    }
		    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		    s[8] = s[13] = s[18] = s[23] = "-";

		    var uuid = s.join("");
		    return uuid;
		}
	};
	
	/**
	 * ########################################################################################################
	 * ##########################################   ROUTE CLASS ###############################################
	 * ########################################################################################################
	 */
	
	/**
	* *************************************************************************************
	* The route object class 
	* *************************************************************************************
	*/
	$.racemap.route = function(newrouteid, newgooglemaps, type){
		this.id = newrouteid;
		this.googlemaps = newgooglemaps;
		this.color = $.racemap.options.strokeColors[this.id % ($.racemap.options.strokeColors.length-1)];
		
		this.path = null;
		this.routeData = []; // array of object types: {marker: ..., waypoint: ...}
		this.label = null;
		this.notinteractive = false;
		
		// internal data
		var eventListener = {
			add : [],
			remove : [],
			drag : [],
			click : [],
			rightclick: [],
		};
		
		if(type === "DISTANCE") {
			options = $.racemap.options.distanceOptions;
		} else {
			options = $.racemap.options.routeOptions;
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
		this.addWaypoint = function(waypoint) {
			var $this = this;

			// create marker
			var marker = new google.maps.Marker({
				map: this.googlemaps,
				position: new google.maps.LatLng(waypoint.coord.lat, waypoint.coord.lng),
				icon: options.markerOptions.image,
				shadow: options.markerOptions.shadow,
				animation: google.maps.Animation.DROP,
				draggable: !this.notinteractive,
				id: this.routeData.length 
			});
			
			var entity = this.routeData[this.routeData.length] = {
				marker: marker,
				waypoint: waypoint
			}
			
			// adds or updates the label
			if(this.label == null) {
				this.addLabel();
			} else {
				this.updateLabel();
			}

			google.maps.event.addListener(marker, 'rightclick', function(event) {
				$this.notify("rightclick", entity);
			});
			
			google.maps.event.addListener(marker, 'click', function(event) {
				$this.notify("click");
			});
			
			this.notify("add");
			
			return marker;
		}
		
		/**
		* *********************************************************************************
		* Adds a new distance marker to the given position.
		* *********************************************************************************
		*/
		this.addDistanceMarker = function(position) {
			var $this = this;

			// create marker
			var marker = new google.maps.Marker({
				map: this.googlemaps,
				position: position,
				icon: options.markerOptions.image,
				shadow: options.markerOptions.shadow,
				animation: google.maps.Animation.DROP,
				draggable: !this.notinteractive,
				id: this.routeData.length 
			});
			this.routeData[this.routeData.length] = {
				marker: marker,
				waypoint: null
			}
			
			// adds or updates the label
			if(this.label == null) {
				if (!this.notinteractive) {
					this.addLabel();
				}
			} else {
				this.updateLabel();
			}

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
			
			this.notify("add");
			
			return marker;
		}
		
		/**
		* *********************************************************************************
		* Adds a label to the last marker.
		* *********************************************************************************
		*/
		this.addLabel = function() {		
			this.label = new Label({map: this.googlemaps });
			this.label.bindTo('position', this.routeData[this.routeData.length-1].marker, 'position');
			$(this.label.span_).css({"margin-left":"15px","padding":"7px","box-shadow":"0px 0px 3px #666","z-index":99999,"color":this.color});
			
			// distance routes have no waypoint and should show the distance, not the boat name
			if (this.routeData[this.routeData.length-1].waypoint != null) {
				this.label.set('text', $.racemap.options.raceData.trips[this.id - 1].boat.name);
			} else {
				this.label.set('text', this.getTotalDistanceText());
			}
		}
		
		/**
		* *********************************************************************************
		* Updates the the label (removes the old and adds a new one).
		* *********************************************************************************
		*/
		this.updateLabel = function() {
			if(this.label != null)
				this.label.setMap(null);
			if(this.routeData.length != 0)
				this.addLabel();
		}
		
		/**
		* *********************************************************************************
		* Removes a whole route from the map (with its paths, labels and routeData).
		* *********************************************************************************
		*/
		this.removeFromMap = function() {
			this.path.setMap(null);
			this.label.setMap(null);
			$.each(this.routeData, function() {
				this.marker.setMap(null);
			});
		}

		/**
		* *********************************************************************************
		* Draws a route by conntecting all route markers in the given order.
		* *********************************************************************************
		*/
		this.drawPath = function() {
			var newPath = new Array();
			for (var i = 0; i < this.routeData.length; ++i) {
				newPath[i] = this.routeData[i].marker.getPosition();
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

			if( this.routeData.length > 1 ) {
				for( var i = 0; i < this.routeData.length - 1; ++i ) {
					dist += this.distance(	this.routeData[i].marker.getPosition().lat(),
									 		this.routeData[i].marker.getPosition().lng(),
									 		this.routeData[i + 1].marker.getPosition().lat(),
									 		this.routeData[i + 1].marker.getPosition().lng())
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
		this.notify = function(type, args) {
			var that = this;
			$.each(eventListener[type], function(){
				if (args) {
					this.call(that, args);
				} else {
					this.call(that, 0);
				}
			});
		}
	};
	
	/**
	 * ########################################################################################################
	 * ########################################   START   #####################################################
	 * ########################################################################################################
	 */
	
	$.racemap.options = options;

	// extend jquery with our new fancy racemap plugin
	$.fn.racemap = function( opts ) {
		if( typeof opts === 'object') {
			$.extend(options, opts);
		}
	
		return this.each(function () {
			$this = $(this);
		
			if($this.data('racemap') === undefined) {
				$this.data('racemap:original', $this.clone());
				var racemap = new $.racemap(this);
				$this.data('racemap', racemap);
			} else {
				$.error("Another initialization of the racemap plugin is not possible!");
			}
		});
	};

})( jQuery, window );