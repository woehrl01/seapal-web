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

		<div class="content-wrapper">
			<div class="container">
				<h1>Logbuch</h1>
				<div class="input-wrapper">
					<form method="post" action="../backend/boat_info_submit.php">
						<div class="row">
							<div class="span4">
								<label for="boat_name">Bootsname</label> 
								<input type="text" name="boat_name" tabindex="1" />
							</div>
							<div class="span4">
								<label for="boat_type">Typ</label>
								<input type="text" name="boat_type" tabindex="9" />
							</div>
							<div class="span4">
								<label for="build_year">Baujahr</label>
								<input type="text" name="build_year" tabindex="17" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="register_nr">Registernr.</label>
								<input type="text" name="register_nr" tabindex="2" />
							</div>
							<div class="span4">
								<label for="constructor">Konstrukteur</label>
								<input type="text" name="constructor" tabindex="10" />
							</div>
							<div class="span4">
								<label for="engine">Motor</label>
								<input type="text" name="engine" tabindex="18" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="sail_sign">Segelzeichen</label>
								<input type="text" name="sail_sign" tabindex="3" />
							</div>
							<div class="span4">
								<label for="length">Länge</label>
								<input type="text" name="length" tabindex="11" />
							</div>
							<div class="span4">
								<label for="fueltank_size">Tankgröße</label>
								<input type="text" name="fueltank_size" tabindex="19" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="home_port">Heimathafen</label>
								<input type="text" name="home_port" tabindex="4" />
							</div>
							<div class="span4">
								<label for="width">Breite</label>
								<input type="text" name="width" tabindex="12" />
							</div>
							<div class="span4">
								<label for="watertank_size">Wassertankgröße</label>
								<input type="text" name="watertank_size" tabindex="20" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="yachtclub">Yachtclub</label>
								<input type="text" name="yachtclub" tabindex="5" />
							</div>
							<div class="span4">
								<label for="draught">Tiefgang</label>
								<input type="text" name="draught" tabindex="13" />
							</div>
							<div class="span4">
								<label for="wastewatertank_size">Abwassertankgröße</label>
								<input type="text" name="wastewatertank_size" tabindex="21" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="owner">Eigner</label>
								<input type="text" name="owner" tabindex="6" />
							</div>
							<div class="span4">
								<label for="mast_height">Masthöhe</label>
								<input type="text" name="mast_height" tabindex="14" />
							</div>
							<div class="span4">
								<label for="mainsail_size">Großsegelgröße</label>
								<input type="text" name="mainsail_size" tabindex="22" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="insurance">Versicherung</label>
								<input type="text" name="insurance" tabindex="7" />
							</div>
							<div class="span4">
								<label for="water_displacement">Verdrängung</label>
								<input type="text" name="water_displacement" tabindex="15" />
							</div>
							<div class="span4">
								<label for="genua_size">Genuagröße</label>
								<input type="text" name="genua_size" tabindex="23" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="callsign">Rufzeichen</label>
								<input type="text" name="callsign" tabindex="8" />
							</div>
							<div class="span4">
								<label for="rig_kind">Rig-Art</label>
								<input type="text" name="rig_kind" tabindex="16" />
							</div>
							<div class="span4">
								<label for="spi_size">Spigröße</label>
								<input type="text" name="spi_size" tabindex="24" />
							</div>
						</div>
					</form>
				</div>
				<div class="listview-wrapper">
					<div class="listview">
						<div class="row">
							<div class="span12">
								<img src="http://placehold.it/960x400&text=Listview" />
							</div>
						</div>
					</div>
					<div class="row">
						<div class="listview-buttons">
							<div class="span6">
								<div class="left">
									<input type="button" class="btn" value="Löschen"/>
									<input type="button" class="btn" value="Speichern"/>
									<input type="button" class="btn" value="Neuester"/>
								</div>
							</div>
							<div class="span6">
								<div class="right">
									<input type="button" class="btn" value="Vorheriger"/>
									<input type="button" class="btn" value="Nächster"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-wrapper">
			<?php include("footer.php"); ?>
		</div>
		
	</body>
</html>