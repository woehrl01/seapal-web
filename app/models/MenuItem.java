package models;

import java.net.URI;
import java.net.URISyntaxException;

public class MenuItem {
	public String name;
	public URI url;

	public MenuItem(String url){
		this("", url);
	}
	
	public MenuItem(String name, String url){
		this.name = name;

		try{
			this.url = new URI(url);
		}catch(URISyntaxException e){
			this.url = null;
		}

	}

	public boolean sameURL(String url){

		try{
			URI target = new URI(url);
			return this.url.equals(target);
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
  			return o.url.equals(this.url);
  		}

  		return false;
  	}

}
