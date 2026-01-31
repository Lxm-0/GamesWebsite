<?php
header("Access-Control-Allow-Origin: *");
header("Access-Content-Type: application/json; charset=UTF-8");
require 'config.php';

$query = "SELECT * FROM games WHERE status='pending' ORDER BY id DESC";
$result = mysqli_query($conn, $query);

$games = [];
while ($row = mysqli_fetch_assoc($result)) {
    $games[] = $row;
}

echo json_encode($games);
?>

