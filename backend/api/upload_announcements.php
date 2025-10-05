<?php
// Upload handler with improved error reporting for debugging
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

try {
    // Attempt to load DB connection, but don't fail if the Mongo extension is missing
    require_once __DIR__ . '/../config/mongo.php';
    $db = null;
    $collection = null;
    $mongoAvailable = false;
    try {
        $db = connectMongoDB();
        $collection = $db->selectCollection('announcements');
        $mongoAvailable = true;
    } catch (Throwable $connectEx) {
        // Log and continue; we'll fall back to local JSON storage
        @file_put_contents('/tmp/deepminds_upload_error.log', "DB connect failed: " . $connectEx->getMessage() . "\n", FILE_APPEND);
        $mongoAvailable = false;
    }

    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $fileData = null;

    if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
        $allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        $fileType = $_FILES['document']['type'];

        if (in_array($fileType, $allowedTypes)) {
            $filename = basename($_FILES['document']['name']);
            // Save files to frontend/uploads so they're publicly accessible by the web root
            $uploadsDir = dirname(__DIR__, 2) . '/frontend/uploads/';
            if (!is_dir($uploadsDir)) {
                if (!mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
                    throw new RuntimeException('Failed to create uploads directory: ' . $uploadsDir);
                }
            }
            $targetPath = $uploadsDir . $filename;
            if (!is_uploaded_file($_FILES['document']['tmp_name'])) {
                throw new RuntimeException('Uploaded file missing or not a valid uploaded file.');
            }
            if (!move_uploaded_file($_FILES['document']['tmp_name'], $targetPath)) {
                throw new RuntimeException('Failed to move uploaded file to: ' . $targetPath);
            }

            $fileData = [
                'name' => $filename,
                'url' => '/uploads/' . $filename,
                'type' => $fileType
            ];
        }
    }
    // Try to insert into DB if available, otherwise append to a JSON fallback file
    if ($mongoAvailable && $collection) {
        $collection->insertOne([
            'title' => $title,
            'description' => $description,
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'file' => $fileData
        ]);
    } else {
        // Fallback: write to frontend/data/announcements.json (most recent first)
        $dataDir = dirname(__DIR__, 2) . '/frontend/data/';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }
        $fallbackFile = $dataDir . 'announcements.json';
        $entry = [
            'title' => $title,
            'description' => $description,
            'created_at' => date(DATE_ATOM),
            'file' => $fileData
        ];
        $existing = [];
        if (is_file($fallbackFile)) {
            $contents = @file_get_contents($fallbackFile);
            $existing = $contents ? json_decode($contents, true) ?? [] : [];
        }
        array_unshift($existing, $entry);
        @file_put_contents($fallbackFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    // Redirect back to frontend lobby
    header('Location: ../../frontend/?page=lobby');
    exit;

} catch (Throwable $e) {
    // Log to a temp file for debugging and output message
    $msg = 'Upload handler error: ' . $e->getMessage();
    @file_put_contents('/tmp/deepminds_upload_error.log', $msg . "\n", FILE_APPEND);
    http_response_code(500);
    echo $msg;
    exit;
}
