<?php
require_once __DIR__ . '/../db_config.php';

$conn = new mysqli($server_name, $db_user, $db_pass, $database_name);

if($conn->connect_error){
  die("Connection failed ".$conn->connect_error);
}
?>