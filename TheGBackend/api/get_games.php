<?php
header('Content-Type: application/json'); 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = mysqli_connect("localhost", "root", "", "test");
mysqli_set_charset($conn, "utf8mb4");

$query = "SELECT * FROM games WHERE status = 'approved'";
$result = mysqli_query($conn, $query);

$games = [];
while($row = mysqli_fetch_assoc($result)) {
    // DO NOT add prefixes here because the DB already contains the full URL
    $games[] = $row;
}

echo json_encode($games);
?>