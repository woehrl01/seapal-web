package utils

import play.api.mvc.{PathBindable, QueryStringBindable, JavascriptLitteral}
import java.util.UUID

object Binders {
  implicit def uuidPathBinder = new PathBindable[UUID] {
    override def bind(key: String, value: String): Either[String, UUID] = {
      Right(UUID.fromString(value))
    }
    override def unbind(key: String, id: UUID): String = {
      id.toString
    }

  }
  
  implicit def uuidJavascriptLitteral = new JavascriptLitteral[UUID]{
  	override def to(value: UUID): String = {
  		if(value == null){
  			"null"
  		}else{
  			"\"" + value.toString + "\""
  		}
  	}
  
  }
  
}