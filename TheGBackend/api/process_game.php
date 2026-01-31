<?php
require 'config.php';

$action = $_GET['action'] ?? null;
$id = intval($_GET['id'] ?? 0);

if (!$action || !$id) {
    echo json_encode(["status" => "error", "message" => "بيانات ناقصة"]);
    exit;
}

$game = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM games WHERE id=$id"));

if ($action == 'accept') {
    $mainImagesDir = "../uploads/MainImages/";
    $mainGamesDir = "../uploads/MainGames/{$id}/";

    if (!is_dir($mainImagesDir))
        mkdir($mainImagesDir, 0777, true);
    if (!is_dir($mainGamesDir))
        mkdir($mainGamesDir, 0777, true);

    $dbImagePath = $game['game_image_path'];

    // Clean URL to local path if necessary
    $localImagePath = str_replace("http://localhost/TheGames/TheGBackend/", "../", $dbImagePath);

    $extension = pathinfo($localImagePath, PATHINFO_EXTENSION);
    $newImageName = $id . "." . $extension;
    $newImageServerPath = $mainImagesDir . $newImageName;

    if (file_exists($localImagePath)) {
        rename($localImagePath, $newImageServerPath);
    }

    // 2. Correct ZIP Handling
    $dbZipPath = $game['game_file_path'];
    $localZipPath = str_replace("http://localhost/TheGames/TheGBackend/", "../", $dbZipPath);

    $zip = new ZipArchive();
    if ($zip->open($localZipPath) === TRUE) {
        $zip->extractTo($mainGamesDir);
        $zip->close();

        // Delete original ZIP
        if (file_exists($localZipPath))
            unlink($localZipPath);

        // Find index.html
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($mainGamesDir));
        $foundIndex = "";
foreach ($files as $file) {
            // Check for index.html (case-insensitive)
            if ($file->isFile() && strcasecmp($file->getFilename(), 'index.html') === 0) {
                // 1. Get the absolute path
                $fullPath = $file->getRealPath();
                
                // 2. CRITICAL: Convert ALL backslashes to forward slashes for the web
                $fullPath = str_replace('\\', '/', $fullPath);
                
                // 3. Find the part of the path that starts with 'uploads/'
                $pos = strpos($fullPath, 'uploads/');
                if ($pos !== false) {
                    $foundIndex = substr($fullPath, $pos);
                }
                break;
            }
        }
        if (empty($foundIndex)) {
            echo json_encode(["status" => "error", "message" => "تم فك الضغط ولكن لم يتم العثور على index.html"]);
            exit;
        }

        $serverUrl = "http://localhost/TheGames/TheGBackend/";
        $finalGameUrl = $serverUrl . $foundIndex;
        $finalImageUrl = $serverUrl . "uploads/MainImages/" . $newImageName;

        mysqli_query($conn, "UPDATE games SET 
            game_image_path = '$finalImageUrl', 
            game_file_path = '$finalGameUrl', 
            status = 'approved' 
            WHERE id = $id");

        echo json_encode(["status" => "success", "message" => "تم القبول !"]);
    } else {
        echo json_encode(["status" => "error", "message" => "فشل فك الـ ZIP - المسار: " . $localZipPath]);
    }
}
// ... (بقية الدالات)
// ... (بقية كود الـ reject والدالة كما هي في الملف السابق)
elseif ($action == 'reject') {
    // جلب البيانات للحذف
    if ($game) {
        if (file_exists($game['game_image_path']))
            unlink($game['game_image_path']);
        if (file_exists($game['game_file_path']))
            unlink($game['game_file_path']);

        $extractedFolder = "../uploads/MainGames/$id/";
        if (is_dir($extractedFolder))
            deleteDirectory($extractedFolder);
    }

    mysqli_query($conn, "DELETE FROM games WHERE id=$id");
    echo json_encode(["status" => "success", "message" => "تم الرفض وحذف الملفات"]);
}

function deleteDirectory($dir)
{
    if (!file_exists($dir))
        return true;
    if (!is_dir($dir))
        return unlink($dir);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..')
            continue;
        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item))
            return false;
    }
    return rmdir($dir);
}
?>