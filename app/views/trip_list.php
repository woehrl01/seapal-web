<?php
	$boat_id = (array_key_exists('boat', $_GET) ? $_GET['boat'] : -1);
?>

<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<?php include("htmlhead.php"); ?>
		<script type="text/javascript" src="js/trip_list.js"></script>
		<script type="text/javascript" src="lib/jquery.paginatetable.js"></script>
		<script type="text/javascript" src="lib/jsrender.js"></script>
	</head>
	<body class="withsubnavi">

		<div class="header-wrapper">
			<?php include("header.php"); ?>
		</div>
			<div class="content-wrapper">
				<div class="container">
					<div class="row">
						<div class="span8">
							<div class="left">
								<h1>Tripliste</h1>
							</div>
						</div>
						<div class="span4">
							<div class="right buttons_top">
								<a id="addButton" href="trip_info.php?boat=<?=$boat_id ?>" class="btn btn-primary"><i class="icon-plus icon-white"></i> <span>Hinzufügen<span></a>
							</div>
						</div>
					</div>
					<input type="hidden" id="boatId" value="<?=$boat_id ?>" />
					<div class="listview-wrapper">
						<div class="listview">
							<div class="row">
								<div class="span12">
									<table id="tripListTable" class="table table-striped table-bordered table-hover">
										<thead>
									        <tr>
									        	<th>Titel</th>
									        	<th>Von</th>
									        	<th>Nach</th>
									        	<th>Datum</th>
									        	<th class="actionCol">Aktionen</th>
									        </tr>
									    </thead>
									    <tbody>
									    </tbody>
									</table>
									<script id="tripListTemplate" type="text/x-jsrender">
										<tr data-id="{{>id}}">
											<td>{{>trip_title}}</td>
											<td>{{>trip_from}}</td>
											<td>{{>trip_to}}</td>
											<td>{{>start_time}}</td>
											<td class="actionCol">
												<a href="#"  class="deleteItemBtn tooltipable" rel="tooltip" title="Löschen"><i class="icon-remove"></i></a>
												<a href="trip_info.php?trip={{>id}}" class="editItemBtn tooltipable" rel="tooltip" title="Auswählen"><i class="icon-chevron-right"></i></a>
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
		<div id="deletePromptModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="deletePromptModalLabel" aria-hidden="true">
		  <div class="modal-header">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3 id="deletePromptModalLabel">Löschen</h3>
		  </div>
		  <div class="modal-body">
		    <p>Möchten Sie wirklich diesen Trip (ID: <span></span>) löschen?</p>
		  </div>
		  <div class="modal-footer">
		  	<button class="btn" data-dismiss="modal" aria-hidden="true">Abbrechen</button>
    		<button class="btn btn-danger" id="deleteModalBtn" data-dismiss="modal">Löschen</button>
		  </div>
		</div>
		
	</body>
</html>