<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
		<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyAL6gKFmwH7gDXmmAW-5VqkW_HbJG7_QLA&sensor=false"></script>
		<script type="text/javascript" src="include/seamap.js"></script>
		<link type="text/css" rel="stylesheet" href="include/seamap.css" />
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
	</body>
</html>