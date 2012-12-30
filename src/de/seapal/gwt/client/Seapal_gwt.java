package de.seapal.gwt.client;

import java.util.Date;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.FlowPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextBox;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class Seapal_gwt implements EntryPoint {
	/**
	 * The message displayed to the user when the server cannot be reached or
	 * returns an error.
	 */
	private static final String SERVER_ERROR = "An error occurred while "
			+ "attempting to contact the server. Please check your network "
			+ "connection and try again.";

	/**
	 * Create a remote service proxy to talk to the server-side Greeting
	 * service.
	 */
	private final BoatServiceAsync boatService = GWT.create(BoatService.class);

	private RootPanel appView = RootPanel.get("gwt");

	public static native void popup() /*-{
		$wnd.jQuery('#addSuccessModal').modal('show');
	}-*/;

	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {
		FlowPanel row = createRow();

		// header linke seite
		FlowPanel header_left = createSpan(8);
		header_left.add(new HTML("<h1>Bootsliste</h1>"));

		// header rechte seite
		FlowPanel header_right = createSpan(4);
		Button savebutton = new Button("Speichern");
		savebutton.setStyleName("btn btn-success right");

		header_right.add(savebutton);

		row.add(header_left);
		row.add(header_right);
		appView.add(row);

		row = createRow();

		FlowPanel input = createSpan(3);
		input.add(new Label("Name"));
		final TextBox name = new TextBox();
		input.add(name);
		row.add(input);

		input = createSpan(3);
		input.add(new Label("Registernr."));
		final TextBox registernr = new TextBox();
		input.add(registernr);
		row.add(input);

		input = createSpan(3);
		input.add(new Label("Typ"));
		final TextBox typ = new TextBox();
		input.add(typ);
		row.add(input);

		input = createSpan(3);
		input.add(new Label("Baujahr"));
		final TextBox baujahr = new TextBox();
		input.add(baujahr);
		row.add(input);

		appView.add(row);

		row = createRow();

		final FlowPanel span = createSpan(12);

		row.add(span);

		appView.add(row);

		// initial load
		boatService.saveBoat("", "", "", "", new AsyncCallback<String>() {
			public void onFailure(Throwable caught) {
			}

			public void onSuccess(String result) {
				span.add(new HTML("<h2>Default Data</h2><pre>"
						+ result.replace("[", "[<br />")
								.replace("},", "},<br />")
								.replace("]", "<br />]") + "</pre>"));
			}
		});

		savebutton.addClickHandler(new ClickHandler() {

			@Override
			public void onClick(ClickEvent event) {
				boatService.saveBoat(name.getText(), registernr.getText(),
						typ.getText(), baujahr.getText(),
						new AsyncCallback<String>() {
							public void onFailure(Throwable caught) {
							}

							public void onSuccess(String result) {
								popup();
								span.add(new HTML("<h2>Response "
										+ new Date()
										+ "</h2><pre>"
										+ result.replace("[", "[<br />")
												.replace("},", "},<br />")
												.replace("]", "<br />]")
										+ "</pre>"));
							}
						}); 
			}
		});
	}

	private FlowPanel createSpan(final int width) {
		final FlowPanel span = new FlowPanel();
		span.addStyleName("span" + width);
		return span;
	}

	private FlowPanel createRow() {
		FlowPanel row = new FlowPanel();
		row.addStyleName("row");
		return row;
	}
}
