<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
		<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyAL6gKFmwH7gDXmmAW-5VqkW_HbJG7_QLA&sensor=false"></script>
		<script type="text/javascript" src="include/label.js"></script>
		<script type="text/javascript" src="include/seamap.js"></script>
		<link type="text/css" rel="stylesheet" href="include/seamap.css" />
	</head>
	<body class="googlemaps">

		<div class="header-wrapper">
			<?php include("header.php"); ?>
		</div>

		<div class="container-fluid" style="height:70%;">
				<h1>Seamap</h1>
				<div class="row-fluid">
					<div class="span6">
						<label for="lat">Lat</label>
						<input id="lat" readonly="readonly" type="text" name="lat" tabindex="1" class="span12" />
					</div>
					<div class="span6">
						<label for="long">Long</label>
						<input id="long" readonly="readonly" type="text" name="long" tabindex="2" class="span12" />
					</div>
				</div>

				<div class="row-fluid" style="width:100%;height:100%;">
					<div class="span12" style="width:100%;height:100%;">
						<div id="map_canvas" class="span12" style="width:100%;"></div>
					</div>
				</div>
		</div>		
	</body>
</html>