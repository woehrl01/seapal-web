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
			<form method="post" action="../backend/log_entry_submit.php">
				<div class="container">
					<h1>Wegpunkt</h1>
					<div class="input-wrapper">
						<div class="row">
							<div class="span6">
								<label for="entry_name">Name</label>
								<input type="text" name="entry_name" style="width:100%;" tabindex="1" />
							</div>
						</div>
						<div class="row">
							<div class="span6">
								<label for="north_degree">Position</label>
								<input type="text" class="compact" name="north_degree" size="3" tabindex="2"/>°
								<input type="text" class="compact" name="north_minutes" size="2" tabindex="3" />'
								<input type="text" class="compact" name="north_seconds" size="2" tabindex="4" />''N
								<input type="text" class="compact shift" name="east_degree" size="3" tabindex="5" />°
								<input type="text" class="compact" name="east_minutes" size="2" tabindex="6" />'
								<input type="text" class="compact" name="east_seconds" size="2" tabindex="7" />''E
							</div>
							<div class="span2">
								<label for="cog">COG</label>
								<input type="text" name="cog" tabindex="10"/>
							</div>
							<div class="span2">
								<label for="sog">SOG</label>
								<input type="text" name="sog" tabindex="18" />
							</div>
							<div class="span2">
								<label for="timestamp">um</label>
								<input type="date" name="timestamp" min="2010-04-18" max="2017-04-18" value="2012-04-18" tabindex="18"/>
							</div>
						</div>
						<div class="row">
							<div class="span3">
								<label for="btm">BTM</label>
								<input type="text" name="btm" tabindex="3" />
							</div>
							<div class="span3">
								<label for="dtm">DTM</label>
								<input type="text" name="dtm" tabindex="11" />
							</div>
							<div class="span4 offset2">
								<label for="trip_to">Fahrt nach</label>
								<select name="trip_to" size="1" style="width:100%;">
									<option>Mark 1</option>
									<option>Mark 2</option>
									<option>Mark 3</option>
									<option>Mark 4</option>
								</select>
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="maneuver_id">Manöver</label>
								<select name="maneuver_id" size="1" style="width:100%;">
									<option>-</option>
									<option>Track</option>
									<option>Jibe</option>
									<option>Lay to</option>
								</select>
							</div>
							<div class="span4">
								<label for="headsail_id">Vorsegel</label>
								<select name="headsail_id" size="1" style="width:100%;">
									<option>-</option>
									<option>Genua1</option>
									<option>Genua2</option>
									<option>Genua3</option>
								</select>
							</div>
							<div class="span4">
								<label for="mainsail_id">Großsegel</label>
							<select name="mainsail_id" size="1" style="width:100%;">
								<option>-</option>
								<option>full</option>
								<option>reef 1</option>
								<option>reef 2</option>
							</select>
							</div>
						</div>	
					</div>
					<div class="gadgets-wrapper">
						<div class="row">
							<div class="span3">
								<div class="round">
									<div class="notes">
										<h4>Notes</h4>
										<div class="gadget">
											<textarea id="notes" cols="20" rows="20"></textarea>
										</div>
									</div>
								</div>
							</div>
							<div class="span6">
								<div class="maps">
									<img src="http://placehold.it/500x300&text=maps"/>
								</div>
							</div>
							<div class="span3">
								<div class="round">
									<div class="photos">
										<h4>Photos</h4>
										<div class="gadget">
											<img width="200" height="200" src="http://placehold.it/200x200/ffffff"/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
		<div class="footer-wrapper">
			<?php include("footer.php"); ?>
		</div>
		
	</body>
</html>