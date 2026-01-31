<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Content-Type: application/json; charset=utf-8');

$conn = mysqli_connect("localhost", "root", "", "test");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = mysqli_connect("localhost", "root", "", "test");
mysqli_set_charset($conn, "utf8mb4");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Connection failed"]);
    exit;
}

$baseUrl = "http://localhost/TheGames/TheGBackend/"; 
?>