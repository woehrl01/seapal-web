<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
	</head>
	<body>

		<div class="header-wrapper">
			<?php include("header.php"); ?>
		</div>

		<div class="content-wrapper" style="width:100%;height:100%;">
				<h1>Seamap</h1>
				<label for="lat">Lat</label>
				<input id="lat" readonly="readonly" type="text" name="lat" tabindex="1" style="width: 100%;" />

				<label for="long">Long</label>
				<input id="long" readonly="readonly" type="text" name="long" tabindex="2" style="width: 100%;" />

				<div class="row" style="width:100%;height:90%;">
					<div id="map_canvas" class="span12" style="width:100%;">

					</div>
				</div>
		</div>	

		<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyAL6gKFmwH7gDXmmAW-5VqkW_HbJG7_QLA&sensor=false"></script>
		<script type="text/javascript">
			$(document).ready(function() {
				//$('#lat').popover({title: "test", content: "content", placement: "top"});
				//$('#lat').popover('show');

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

    				updateTooltip(marker.getPosition());
  				});

		    	var marker = null;

		    	$("#map_canvas").append('<div id="tooltip_helper" style="width:1px; height:1px; position:absolute; margin-top: -10px; margin-left: 10px; z-index:1; display: block;"></div>');

				google.maps.event.addListener(map, 'click', function(event) {
					var crosshairShape = {coords:[0,0,0,0],type:'rect'};

					if (marker != null) {
						marker.setMap(null);
					}
					marker = new google.maps.Marker({
						position: event.latLng,
						map: map,
						title:"123456",
						shape: crosshairShape,
						icon: 'http://www.daftlogic.com/images/cross-hairs.gif'
					});

					var content = '<div class="btn-group" data-toggle="buttons-checkbox"><button type="button" class="btn">Left</button><button type="button" class="btn">Left</button><button type="button" class="btn">Left</button></div>';

					$('#tooltip_helper').popover({title: "test", html : true, content: content, placement: function(){
							var leftDist = $('#tooltip_helper').position().left;
							var width = $('#map_canvas').width();

							return (leftDist > width / 2 ? "left" : "right");
						}
					});
					updateTooltip(event.latLng);
					
					

				});

				function updateTooltip(latLng){
					var pos = getCanvasXY(latLng);

					$('#tooltip_helper').css({top:pos.y, left:pos.x});
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
		</script>
	
	</body>
</html>