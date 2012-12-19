<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
		<script type="text/javascript" src="include/boat_info.js"></script>
		<script type="text/javascript" src="include/jquery.paginatetable.js"></script>
		<script type="text/javascript" src="include/jsrender.js"></script>
	</head>
	<body>

		<div class="header-wrapper">
			<?php include("header.php"); ?>
		</div>
		<form id="form" method="post" action="../backend/boat_service.php">
			<input type="hidden" name="method" value="save"/>
			<input type="hidden" id="idField" name="id" value="-1"/>
			<div class="content-wrapper">
				<div class="container">
					<div class="row">
						<div class="span8">
							<div class="left">
								<h1>Bootliste</h1>
							</div>
						</div>
						<div class="span4">
							<div class="right buttons_top">
								<a id="addButton" class="btn btn-primary"><i class="icon-plus icon-white"></i> <span>Hinzufügen<span></a>
								<input type="submit" id="submitBtn" class="btn btn-success" value="Speichern"/>
							</div>
						</div>
					</div>
					<div class="input-wrapper" id="boat_input">
						<div class="row">
							<div class="span4">
								<label for="boat_name">Bootsname</label> 
								<input type="text" name="boat_name" tabindex="1" required />
							</div>
							<div class="span4">
								<label for="boat_type">Typ</label>
								<input type="text" name="boat_type" tabindex="9" />
							</div>
							<div class="span4">
								<label for="build_year">Baujahr</label>
								<input type="number" name="build_year" tabindex="17" min="1900" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="register_nr">Registernr.</label>
								<input type="number" name="register_nr" tabindex="2" />
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
								<label for="boat_length">Länge</label>
								<input type="number" name="boat_length" tabindex="11" min="0.1" step="0.1" />
							</div>
							<div class="span4">
								<label for="fueltank_size">Tankgröße</label>
								<input type="number" name="fueltank_size" tabindex="19" min="0" step="0.1"  />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="home_port">Heimathafen</label>
								<input type="text" name="home_port" tabindex="4" />
							</div>
							<div class="span4">
								<label for="boat_width">Breite</label>
								<input type="number" name="boat_width" tabindex="12" min="0.1" step="0.1" />
							</div>
							<div class="span4">
								<label for="watertank_size">Wassertankgröße</label>
								<input type="number" name="watertank_size" tabindex="20" min="0" step="0.1" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="yachtclub">Yachtclub</label>
								<input type="text" name="yachtclub" tabindex="5" />
							</div>
							<div class="span4">
								<label for="draught">Tiefgang</label>
								<input type="number" name="draught" tabindex="13" min="0" step="0.1" />
							</div>
							<div class="span4">
								<label for="wastewatertank_size">Abwassertankgröße</label>
								<input type="number" name="wastewatertank_size" tabindex="21" min="0" step="0.1" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="owner">Eigner</label>
								<input type="text" name="owner" tabindex="6" />
							</div>
							<div class="span4">
								<label for="mast_height">Masthöhe</label>
								<input type="number" name="mast_height" tabindex="14" min="0" step="0.1" />
							</div>
							<div class="span4">
								<label for="mainsail_size">Großsegelgröße</label>
								<input type="number" name="mainsail_size" tabindex="22" min="0" step="0.1" />
							</div>
						</div>
						<div class="row">
							<div class="span4">
								<label for="insurance">Versicherung</label>
								<input type="text" name="insurance" tabindex="7" />
							</div>
							<div class="span4">
								<label for="water_displacement">Verdrängung</label>
								<input type="number" name="water_displacement" tabindex="15" min="0" step="0.1" />
							</div>
							<div class="span4">
								<label for="genua_size">Genuagröße</label>
								<input type="number" name="genua_size" tabindex="23" min="0" step="0.1" />
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
								<input type="number" name="spi_size" tabindex="24" min="0" step="0.1" />
							</div>
						</div>
						
					</div>
					<div class="listview-wrapper">
						<div class="listview">
							<div class="row">
								<div class="span12">
									<table id="boatListTable" class="table table-striped table-bordered table-hover">
										<thead>
									        <tr>
									        	<th>Name</th>
									        	<th>Baujahr</th>
									        	<th>Aktionen</th>
									        </tr>
									    </thead>
									    <tbody>
									    </tbody>
									</table>
									<script id="boatListTemplate" type="text/x-jsrender">
										<tr data-boatid="{{>id}}">
											<td>{{>boat_name}}</td>
											<td>{{>build_year}}</td>
											<td>
												<a href="#" class="editBoadBtn"><i class="icon-pencil"></i></a>
												<a href="#" class="deleteBoadBtn"><i class="icon-remove"></i></a>
												<a href="trip_list.php?boat={{>id}}"><i class="icon-chevron-right"></i></a>
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
		    <p>Möchten Sie wirklich das Boot (ID: <span></span>) löschen?</p>
		  </div>
		  <div class="modal-footer">
		  	<button class="btn" data-dismiss="modal" aria-hidden="true">Abbrechen</button>
    		<button class="btn btn-danger" id="deleteModalBtn" data-dismiss="modal">Löschen</button>
		  </div>
		</div>
		
	</body>
</html>