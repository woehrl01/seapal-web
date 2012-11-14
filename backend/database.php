<?php
class DBConnector {
    private $ident;
    private $result;
    private $sql = array(
                        'host'=>'localhost',
                        'user'=>'',
                        'pass'=>'',
                        'db'=>''
                        );
 
    public function connect ()
    {
        $this->ident = mysql_connect($this->sql['host'], $this->sql['user'], $this->sql['pass']);

        if (!mysql_select_db($this->sql['db'])) {
           die("Could not connect to DB");
       }
    }

    public function query($queryString){
        $this->$result = mysql_query($queryString) or die(mysql_error());
    }

    public function getNextRow() {
        return mysql_fetch_assoc($this->result);
    }

    public function disconnect ()
    {
        if (!mysql_close($this->ident)) {
            die("Could not close DB");
        }
    }
}

?>
