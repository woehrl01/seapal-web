<?php

$filename = basename($_SERVER['SCRIPT_FILENAME']);

function print_nav_element($name, $href) {
	global $filename;
	
	$class = "";
	$hrefs = array_slice(func_get_args(), 1);
	
	if(contains($filename, $hrefs)){
		$class = "active";	
	}

	echo '<li class="'.$class.'"><a href="'.$href.'">'.$name.'</a></li>';
}

function contains($filename, $name){
	if(is_array($name)) {
		$names = $name;
	} else {
		$names = array_slice(func_get_args(), 1);
	}
	
	foreach($names as $name){		
		if($filename === $name){
			return true;
		}
	}
	
	return false;
}

?>
<div class="navbar-fixed-top">
	<div class="navbar">
		<div class="navbar-inner">
			<div class="container"> 
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> 
					<span class="icon-bar"></span> 
					<span class="icon-bar"></span> 
					<span class="icon-bar"></span> 
					<span class="icon-bar"></span> 
				</a> 
				<a class="brand" href="index.php">SEAPAL</a>
				<div class="nav-collapse collapse">
					<ul class="nav">
						<?php print_nav_element( "Start", "index.php", "" ); ?>
						<?php print_nav_element( "How To", "user_guide.php" ); ?>
						<?php print_nav_element( "Screenshots", "screenshots.php" ); ?>
						<?php print_nav_element( "Team", "about.php" ); ?>
						<?php print_nav_element( "Kontakt", "contact.php" ); ?>
						<?php print_nav_element( "Web-App", "boat_info.php", "boat_info.php", "log_entry.php", "trip_info.php", "seamap.php" ); ?>
					</ul>
				</div>
				<!--/.nav-collapse --> 
			</div>
		</div>
	</div>
	<?php 
		if( contains( $filename, "boat_info.php", "log_entry.php", "trip_info.php", "seamap.php" ) ){
			include( "header-app.php" );
		}
	?>
</div>