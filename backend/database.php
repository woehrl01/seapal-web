<?php
include("_config.inc.php");

final class DBConnector {
    private $ident;
	private $result;
						
	private static $instance = NULL;
 
 	private function __construct(){}
	private function __clone(){}
	
	public static function getConnection()
	{
		if (NULL === self::$instance) {
           self::$instance = new self;
       	}
		
		self::$instance->connect();
		
       	return self::$instance;	
	} 
 
    private function connect ()
    {	
		global $host, $user, $password, $db;
	
        $this->ident = mysql_connect($host, $user, $password);

        if (!mysql_select_db($db)) {
           die("Could not connect to DB");
       }
    }

    public function query($queryString){
        $this->result = mysql_query($queryString) or die(mysql_error());
    }

    public function getNextRow() {
        return mysql_fetch_assoc($this->result);
    }

    public static function close ()
    {
        self::$instance->disconnect();
    }
	
	private function disconnect ()
    {
        if (!mysql_close($this->ident)) {
            die("Could not close DB");
        }
    }
}

?>
