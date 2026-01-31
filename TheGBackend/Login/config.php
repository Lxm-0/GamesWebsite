<?php
$server_name = 'localhost';
$user = 'root';
$pass = '';
$database = 'gameswebsit_db';

$conn = new mysqli($server_name,$user,$pass,$database);

if($conn->connect_error){
  die("Connection failed ".$conn->connect_error);
}

?>