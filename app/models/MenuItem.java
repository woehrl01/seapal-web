package models;

import java.net.URI;
import java.net.URISyntaxException;

public class MenuItem {
	public String name;
	public URI uri;

	public MenuItem(String uri){
		this("", uri);
	}
	
	public MenuItem(String name, String uri){
		this.name = name;

		try{
			this.uri = new URI(uri);
		}catch(URISyntaxException e){
			this.uri = URI.create("");
		}
	}

	public boolean sameURI(String uriString){

		try{
			URI uri = new URI(uriString);
			return this.uri.equals(uri);
		}catch(URISyntaxException e){
			return false;
		}
	}

	@Override
  	public boolean equals(Object other){
  		if(other == null){
  			return false;
  		}

  		if(other == this) {
			return true;
		}

		if(other instanceof MenuItem){
  			MenuItem o = (MenuItem) other;
  			return o.uri.equals(this.uri);
  		}

  		return false;
  	}

}
