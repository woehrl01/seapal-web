<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
		<link type="text/css" rel="stylesheet" href="lib/datepicker/css/datepicker.css" />
		<script type="text/javascript" src="lib/datepicker/js/bootstrap-datepicker.js"></script>
		<script type="text/javascript" src="js/trip_info.js"></script>
		<script type="text/javascript" src="lib/jquery.paginatetable.js"></script>
		<script type="text/javascript" src="lib/jsrender.js"></script>
		<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyAL6gKFmwH7gDXmmAW-5VqkW_HbJG7_QLA&sensor=false"></script>
		<script type="text/javascript" src="lib/label.js"></script>
		<script type="text/javascript" src="lib/seamap/seamap-1.0.0.js"></script>
	</head>
	<body class="withsubnavi">

		<div class="header-wrapper">
			<?php include("header.php"); ?>
		</div>

		<div class="content-wrapper">
			<form id="form" method="post" action="../backend/trip_service.php">
				<input type="hidden" name="method" value="save" />
				<input type="hidden" id="trip_id" name="id" value="<?= (array_key_exists('trip', $_GET) ? $_GET['trip'] : -1) ?>" />
				<input type="hidden" id="boat_id" name="boat_id" value="<?= (array_key_exists('boat', $_GET) ? $_GET['boat'] : -1) ?>" />
				<div class="container">
					<div class="row">
						<div class="span8">
							<div class="left">
								<h1>Trip Info</h1>
							</div>
						</div>
						<div class="span4">
							<div class="right buttons_top">
								<input type="submit" id="submitBtn" class="btn btn-success" value="Speichern"/>
							</div>
						</div>
					</div>
					<div class="input-wrapper">
						<div class="row">
							<div class="span6">
								<label for="trip_title">Trip Titel</label>
								<input type="text" name="trip_title" tabindex="1" style="width: 100%;" required />
							</div>
						</div>
						<div class="row">
							<div class="span3">
								<div class="row">
									<div class="span3">
										<label for="trip_from">Von</label>
										<input type="text" name="trip_from" tabindex="2" />
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="trip_to">Nach</label>
										<input type="text" name="trip_to" tabindex="3" />
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
										<div class="datepicker input-append date" data-date="2013-01-17" data-date-format="yyyy-mm-dd">
  											<label for="start_time">Start</label>
  											<input class="span2" size="16" type="text" name="start_time" tabindex="6" value="2013-01-17"/>
  											<span class="add-on">
  												<i class="icon-th"></i>
  											</span>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<div class="datepicker input-append date" data-date="2013-01-17" data-date-format="yyyy-mm-dd">
  											<label for="start_time">Ende</label>
  											<input class="span2" size="16" type="text" name="end_time" tabindex="7" value="2013-01-17"/>
  											<span class="add-on">
  												<i class="icon-th"></i>
  											</span>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="span3">
										<label for="timespan">Dauer (min)</label>
										<input type="number" name="timespan" tabindex="8" min="1"/>
									</div>
								</div>
							</div>
							<div class="span3">
								<div class="row">
									<div class="span3">
										<label for="engine_runtime">Motor (min)</label>
										<input type="number" name="engine_runtime" tabindex="9" min="0" />
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
					</div>
					<div class="gadgets-wrapper">
						<div class="row">
							<div class="span3">
								<div class="round">
									<div class="notes">
										<h4>Notes</h4>
										<div class="gadget">
											<textarea id="notes" name="note" cols="20" rows="20"></textarea>
										</div>
									</div>
								</div>
							</div>
							<div class="span6">
								<div class="round">
									<div id="mini_map"></div>
								</div>
							</div>
							<div class="span3">
								<div class="round">
									<div class="photos">
										<h4>Photos</h4>
										<div class="gadget">
											<img width="230" height="230" src="images/photo1.jpg"/>
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
									<table id="waypointListTable" class="table table-striped table-bordered table-hover">
										<thead>
									        <tr>
									        	<th>Wegpunkt</th>
									        	<th>Position</th>
									        	<th class="actionCol">Aktionen</th>
									        </tr>
									    </thead>
									    <tbody>
									    </tbody>
									</table>
									<script id="waypointListTemplate" type="text/x-jsrender">
										<tr data-id="{{>id}}">
											<td>{{>entry_name}}</td>
											<td>{{>position_lat}}, {{>position_lon}}</td>
											<td class="actionCol">
												<a href="#"  class="deleteBoadBtn tooltipable" rel="tooltip" title="Löschen"><i class="icon-remove"></i></a>
												<a href="#" class="editBoadBtn tooltipable" rel="tooltip" title="Betrachten"><i class="icon-chevron-right"></i></a>
											</td>
										</tr>
									</script>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="listview-buttons tablePager">
								<div class="span6">
									<div class="left">
										<a href="log_entry.php?trip=<?= (array_key_exists('trip', $_GET) ? $_GET['trip'] : -1) ?>" class="btn btn-primary"><i class="icon-plus icon-white"></i> Neuer Wegpunkt<a/>
										
										<input type="button" class="btn prevPage" value="Vorheriger"/>
									</div>
								</div>
								<div class="span6">
									<div class="right ">
										<input type="button" class="btn nextPage" value="Nächster"/>
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

		<div id="addSuccessModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="addSuccessModalLabel" aria-hidden="true">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3 id="addSuccessModalLabel">Erfolgreich!</h3>
		  </div>
		  <div class="modal-body">
		    <p>Die Daten wurden erfolgreich übermittelt!</p>
		  </div>
		  <div class="modal-footer">
		    <button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button>
		  </div>
		</div>

		<div id="deletePromptModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="deletePromptModalLabel" aria-hidden="true">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3 id="deletePromptModalLabel">Löschen</h3>
		  </div>
		  <div class="modal-body">
		    <p>Möchten Sie wirklich den Wegpunkt (ID: <span></span>) löschen?</p>
		  </div>
		  <div class="modal-footer">
		  	<button class="btn" data-dismiss="modal" aria-hidden="true">Abbrechen</button>
    		<button class="btn btn-danger" id="deleteModalBtn" data-dismiss="modal">Löschen</button>
		  </div>
		</div>
		
	</body>
</html>