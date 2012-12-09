<?php
include("_config.inc.php");

/**
 * The database connection manager singleton class.
 */
final class DBConnector {
    private $connection;
	private $result;
						
	private static $instance = NULL;
 
 	private function __construct(){}
	private function __clone(){}
	
    /**
     * Connects to the database and returns the connection.
     * @return The connection instance.
     */
	public static function getConnection()
	{
		if (NULL === self::$instance) {
           self::$instance = new self();
       	}
		
		self::$instance->connect();
		
       	return self::$instance;	
	} 
 
    /**
     * Conntects to the database.
     */
    private function connect()
    {	
		global $host, $user, $password, $db;
	
        $this->connection = mysql_connect($host, $user, $password);

        if (!mysql_select_db($db)) {
           die("Could not connect to DB");
       }
    }

    /**
     * Execuetes a new sql query.
     * @param queryString The query string.
     */
    public function query($queryString){
        $this->result = mysql_query($queryString) or die(mysql_error());
    }

    /**
     * Gets the next row as an associative array.
     * @return The next row as an associative array or FALSE, if there is no next row.
     */
    public function getNextRow() {
        return mysql_fetch_assoc($this->result);
    }

    /**
     * Closes the database connection.
     */
    public static function close()
    {
        self::$instance->disconnect();
    }
	
    /**
     * Disconnects the database.
     */
	private function disconnect()
    {
        if (!mysql_close($this->connection)) {
            die("Could not close DB");
        }
    }
}

?>
