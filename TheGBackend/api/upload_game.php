<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require 'config.php';

$Name = $_POST['gameName'] ?? '';
$Details = $_POST['gameDescription'] ?? '';

if (!isset($_FILES['Gamefile']) || !isset($_FILES['GameImage'])) {
    echo json_encode(["status" => "error", "message" => "عفواً! يجب عليك اختيار ملف اللعبة وصورة الغلاف أولاً."]);
    exit;
}

// 2. تحقق من تكرار الاسم في قاعدة البيانات
$checkSql = "SELECT id FROM games WHERE title = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $Name);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "هذه اللعبة موجودة مسبقاً، جرب اسماً آخر!"]);
    exit;
}
$serverUrl = "http://localhost/TheGames/TheGBackend/api/";
// 4. تجهيز المسارات
$tempImagesDir = "uploads/TempImages/";
$tempGamesDir = "uploads/TempGames/";

if (!is_dir($tempImagesDir))
    mkdir($tempImagesDir, 0777, true);
if (!is_dir($tempGamesDir))
    mkdir($tempGamesDir, 0777, true);

$timestamp = time();
$imgName = $timestamp . "_" . basename($_FILES['GameImage']['name']);
$zipName = $timestamp . "_" . basename($_FILES['Gamefile']['name']);

$targetImg = $tempImagesDir . $imgName;
$targetZip = $tempGamesDir . $zipName;

// 5. نقل الملفات للمجلدات
if (
    move_uploaded_file($_FILES['GameImage']['tmp_name'], $targetImg) &&
    move_uploaded_file($_FILES['Gamefile']['tmp_name'], $targetZip)
) {
    $savedImg = $serverUrl. $targetImg;
    $savedZip = $serverUrl.$targetZip;

    // 6. الإدخال الفعلي في قاعدة البيانات
    $sql = "INSERT INTO games (title, description, game_image_path, game_file_path, status) 
            VALUES (?, ?, ?, ?, 'pending')";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $Name, $Details, $savedImg , $savedZip);

    if ($stmt->execute()) {
        // هنا تظهر الرسالة الناجحة الحقيقية
        echo json_encode(["status" => "success", "message" => "تم رفع اللعبة بنجاح وحفظ بياناتها!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "فشل الحفظ في القاعدة: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "فشل نقل الملفات للمجلدات، تأكد من حجم الملفات"]);
}