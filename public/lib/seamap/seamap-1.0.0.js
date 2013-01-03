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
		defaultRoute 	: null,
		mode 			: "INTERACTIVE",
		startLat 		: 47.655,
		startLong 		: 9.205,
		zoom 			: 15,
		
		height : function() {
			return $(window).height() - $(".header-wrapper .navbar-fixed-top").height() - 20
		},	
		strokeColors : ['grey','red','blue','green','yellow','black'],
		
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
			$this.on("click", "#setAsDestination", handleSetAsDestination);
			$this.on("click", "#addNewDistanceRoute", handleAddNewDistanceRoute);
			$this.on("click", "#hideContextMenu", handleHideContextMenu);
		}
				
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function initGoogleMapsListeners() {
			google.maps.event.addListener(map, 'bounds_changed', function() {
				if (crosshairMarker != null && contextMenuVisible) {
					updateContextMenuPosition(crosshairMarker.getPosition());
				}
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
			
			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE");	
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
			jsRoutes.controllers.BoatPositionAPI.current().ajax({
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
		* 
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
					icon: options.crosshairOptions.markerOptions.image
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
						+ '<button id="setAsDestination" type="button" class="btn"><i class="icon-star"></i> Zum Ziel machen</button>'
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
		function showSidebarWithRoute(route) {
			showSidebar('Route <span class="badge" style="background-color:' + route.color + ';">#' + route.id + '</span>');
			appendContentIntoSidebar('<ul class="nav nav-tabs nav-stacked"></ul>');
			appendContentIntoSidebar('<div class="buttons_bottom"><div><a class="closeIt btn btn-block" href="#close">Routenaufzeichnung beenden</a></div></div>');

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
		function appendMarkerIntoSidebar(marker) {	
			var content = $('<li class="well well-small"><div class="btn-toolbar pull-right" style="margin:0"> \
					<div class="btn-group"><a class="delete btn" href="#page?deleteId='+marker.id+'"><i class="icon-remove"></i></a></div></div> \
					<b>#' + marker.id + '</b> <small>- Lat ' + toGeoString(marker.getPosition().lat(), "N", "S", 2) + ' Lon ' + 
					toGeoString(marker.getPosition().lng(), "E", "W", 3) + '</small></li>');
			appendContentIntoSidebarElement(content, '.nav');
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
			
			activeRoute = distanceroute = new $.seamap.route(-1, map, "DISTANCE");			
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

			activeRoute = routes[routeId] = new $.seamap.route(routeId, map, "ROUTE");		
			
			activate = function() {
				activateRoute(this);
			}
			
			activeRoute.addEventListener("remove", activate);	
			activeRoute.addEventListener("dragend", activate);	
			activeRoute.addEventListener("click", activate);
		
			addRouteMarker(crosshairMarker.getPosition());
			activateRoute(activeRoute);
		}
				
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		function activateRoute(route) {
			showSidebarWithRoute(route);
			activeRoute = route;
			state = States.ROUTE;	
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
				appendMarkerIntoSidebar(newmarker);
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
		function handleSetAsDestination() {
			hideContextMenu();
			hideCrosshairMarker();

			destpath.setMap(map);
			destpath.setPath([boatMarker.getPosition(), crosshairMarker.getPosition()]);
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
		
		/**
		* *********************************************************************************
		* 
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
	* Route class 
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
			dragend : [],
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
				icon: options.markerOptions.image,
				shadow: options.markerOptions.shadow,
				animation: google.maps.Animation.DROP,
				draggable: !this.notinteractive,
				id: this.markers.length 
			});
			
			this.markers[this.markers.length] = marker;
			
			if(this.label == null) {
				this.addLabel();	
			} else {
				this.updateLabel();
			}

			if(!this.notinteractive) {
				google.maps.event.addListener(marker, 'dragend', function() {
					$this.drawPath();
					$this.updateLabel();
					$this.notify("dragend");
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
		* 
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
		* 
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
		* 
		* *********************************************************************************
		*/
		this.updateLabel = function() {
			if(this.label != null) this.label.setMap(null);
			if(this.markers.length != 0) this.addLabel();
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
		
		/**
		* *********************************************************************************
		* 
		* *********************************************************************************
		*/
		this.addEventListener = function(type, fn) {
			eventListener[type][ eventListener[type].length ] = fn;
		}
				
		/**
		* *********************************************************************************
		* 
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