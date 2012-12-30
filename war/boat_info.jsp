<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE HTML>
<html>
	<head>
		<title>SeaPal</title>
		<%@ include file="htmlhead.jsp" %>
		<script type="text/javascript" src="frontend/js/boat_info.js"></script>
		<script type="text/javascript" src="frontend/lib/jquery.paginatetable.js"></script>
		<script type="text/javascript" src="frontend/lib/jsrender.js"></script>
		<script type="text/javascript" language="javascript" src="seapal_gwt/seapal_gwt.nocache.js"></script>
	</head>
	<body class="">

		<div class="header-wrapper">
			<%@ include file="header.jsp" %>
		</div>
		
		<!-- GWT DOM starting point -->
		<div class="container input-wrapper" id="gwt"></div>
		
		<div class="content-wrapper">
			<div class="container">
				<div class="listview-wrapper">
					<div class="listview">
						<div class="row">
							<div class="span12" id="boatListTable">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-wrapper">
			<%@ include file="footer.jsp" %>
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
		
	</body>
</html>
