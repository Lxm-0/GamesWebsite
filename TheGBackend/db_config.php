<?php
$server_name = 'localhost';
$db_user = 'root';
$db_pass = '';
$database_name = 'gameswebsit_db';

$conn = new mysqli($server_name, $db_user, $db_pass, $database_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for proper unicode support
$conn->set_charset("utf8mb4");
?>
