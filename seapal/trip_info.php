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
				<h1>Trip info</h1>
				<div class="input-wrapper">
					<form method="post" action="../backend/trip_info_submit.php">
						<div class="row">
							<div class="span6">
								<label for="trip_title">Trip Titel</label>
								<input type="text" name="trip_title" tabindex="1" style="width: 100%;" />
							</div>
						</div>
						<div class="row">
							<div class="span3">
								<div class="row">
									<div class="span3">
										<label for="from">Von</label>
										<input type="text" name="from" tabindex="2" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="to">Nach</label>
										<input type="text" name="to" tabindex="3" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="skipper">Skipper</label>
										<input type="text" name="skipper" tabindex="4" />
									</div>
								</div>
							</div>
							<div class="span3">
								<label for="crew">Crew</label>
								<textarea name="crew" cols="20" rows="5" tabindex="9"></textarea>
							</div>
							<div class="span3">
								<div class="row">
									<div class="span3">
										<label for="start_time">Start</label>
										<input type="datetime" name="start_time" tabindex="6" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="end_time">Ende</label>
										<input type="datetime" name="end_time" tabindex="7" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="timespan">Dauer</label>
										<input type="number" name="timespan" tabindex="8" />
									</div>
								</div>
							</div>
							<div class="span3">
								<div class="row">
									<div class="span3">
										<label for="engine_runtime">Motor(min)</label>
										<input type="text" name="engine_runtime" tabindex="9" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="tank_filled">Tank gefüllt</label>
										<input type="checkbox" name="tank_filled" tabindex="10" />
									</div>
								</div>
							</div>
						</div>
					</form>
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
				<div class="listview-wrapper">
					<div class="listview">
						<div class="row">
							<div class="span12">
								<img src="http://placehold.it/960x300&text=Listview" />
							</div>
						</div>
					</div>
					<div class="row">
						<div class="listview-buttons">
							<div class="span6">
								<div class="left">
									<input type="button" class="btn" value="Neuer Eintrag"/>
									<input type="button" class="btn" value="Löschen"/>
									<input type="button" class="btn" value="Filter"/>
								</div>
							</div>
							<div class="span6">
								<div class="right">
									<input type="button" class="btn" value="Erster"/>
									<input type="button" class="btn" value="Letzter"/>
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