<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container"> <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </a> <a class="brand" href="index.php">SEAPAL</a>
			<div class="nav-collapse collapse">
				<ul class="nav">
					<li class="active"><a href="index.php">Start</a></li>
					<li><a href="user_guide.php">How To</a></li>
					<li><a href="screenshots.php">Screenshots</a></li>
					<li><a href="about.php">Team</a></li>
					<li><a href="contact.php">Kontakt</a></li>
				</ul>
			</div>
			<!--/.nav-collapse --> 
		</div>
	</div>
</div>
<?php if(!strstr($_SERVER['SCRIPT_NAME'],"index.php")) : ?>
<div id="webapp-menu-pill" class="container">
	<ul class="nav nav-pills">
		<li class="active"><a href="boat_info.php">Boat Info</a></li>
		<li><a href="trip_info.php">Trip Info</a></li>
		<li><a href="log_entry.php">Log Entry</a></li>
		<li><a href="seamap.php">Seamap</a></li>
	</ul>
</div>
<?php endif;
