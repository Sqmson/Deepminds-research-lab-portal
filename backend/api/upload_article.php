<?php
// Article uploader: uploads images to Cloudinary when configured, inserts article
// documents into MongoDB, and appends to frontend/data/articles.json as a local
// fallback for environments without DB access.
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo 'Method not allowed';
        exit;
    }

    $title = $_POST['title'] ?? '';
    $excerpt = $_POST['excerpt'] ?? '';
    $content = $_POST['content'] ?? '';
    $author = $_POST['author'] ?? '';
    $category = $_POST['category'] ?? '';
    $tags = isset($_POST['tags']) ? array_map('trim', explode(',', $_POST['tags'])) : [];

    if (empty($title) || empty($content)) {
        throw new RuntimeException('Title and content are required');
    }

    $fileUrl = '';
    $cloudinaryUrl = '';

    // If image uploaded, try Cloudinary when configured
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
        $type = $_FILES['image']['type'];
        if (in_array($type, $allowed)) {
            $tmpPath = $_FILES['image']['tmp_name'];

            // Cloudinary config from .env
            $cloudName = getenv('CLOUDINARY_CLOUD_NAME') ?: ($_ENV['CLOUDINARY_CLOUD_NAME'] ?? null);
            $apiKey = getenv('CLOUDINARY_API_KEY') ?: ($_ENV['CLOUDINARY_API_KEY'] ?? null);
            $apiSecret = getenv('CLOUDINARY_API_SECRET') ?: ($_ENV['CLOUDINARY_API_SECRET'] ?? null);

            if ($cloudName && $apiKey && $apiSecret && function_exists('curl_version')) {
                // Upload to Cloudinary using unsigned/simple REST API
                $timestamp = time();
                $publicId = 'articles/' . bin2hex(random_bytes(6)) . '-' . $timestamp;

                // Build signature if desired (server side) - Cloudinary typically requires signed uploads
                $paramsToSign = 'public_id=' . $publicId . '&timestamp=' . $timestamp . $apiSecret;
                $signature = sha1($paramsToSign);

                $post = [
                    'file' => new CURLFile($tmpPath, $type, basename($_FILES['image']['name'])),
                    'timestamp' => $timestamp,
                    'api_key' => $apiKey,
                    'public_id' => $publicId,
                    'signature' => $signature
                ];

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, 'https://api.cloudinary.com/v1_1/' . $cloudName . '/image/upload');
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
                $resp = curl_exec($ch);
                $err = curl_error($ch);
                curl_close($ch);

                if ($err) {
                    error_log('Cloudinary upload error: ' . $err);
                } else {
                    $json = json_decode($resp, true);
                    if (isset($json['secure_url'])) {
                        $cloudinaryUrl = $json['secure_url'];
                    } else {
                        error_log('Cloudinary unexpected response: ' . $resp);
                    }
                }
            }

            // If Cloudinary didn't give a URL, fall back to local storage
            if (empty($cloudinaryUrl)) {
                $orig = basename($_FILES['image']['name']);
                $ext = pathinfo($orig, PATHINFO_EXTENSION);
                $name = preg_replace('/[^a-zA-Z0-9-_\.]/', '-', pathinfo($orig, PATHINFO_FILENAME));
                $unique = $name . '-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
                $uploadsDir = dirname(__DIR__, 2) . '/frontend/uploads/';
                if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);
                $target = $uploadsDir . $unique;
                if (!move_uploaded_file($tmpPath, $target)) {
                    throw new RuntimeException('Failed to move uploaded image to local uploads');
                }
                $fileUrl = '/uploads/' . $unique;
            }
        }
    }

    // Build article entry
    $entry = [
        'title' => $title,
        'excerpt' => $excerpt,
        'content' => $content,
        'author' => $author,
        'category' => $category,
        'tags' => $tags,
        'image_url' => $cloudinaryUrl ?: $fileUrl,
        'date' => new MongoDB\BSON\UTCDateTime()
    ];

    $inserted = false;
    try {
        // Try to insert into MongoDB using the model
        require_once __DIR__ . '/../models/Article.php';
        // The Article model expects sanitized input and will insert the document
        $articleModel = new Article();
        $created = $articleModel->create($entry);
        $inserted = true;
    } catch (Throwable $e) {
        error_log('Article insert to MongoDB failed: ' . $e->getMessage());
        // We'll still write to fallback JSON below
    }

    // Fallback JSON storage (workspace copy)
    $dataDir = dirname(__DIR__, 2) . '/frontend/data/';
    if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
    $file = $dataDir . 'articles.json';
    $existing = [];
    if (is_file($file)) {
        $contents = @file_get_contents($file);
        $existing = $contents ? json_decode($contents, true) ?? [] : [];
    }

    // Normalize date for JSON fallback
    $entryForJson = $entry;
    if ($entryForJson['date'] instanceof MongoDB\BSON\UTCDateTime) {
        $entryForJson['date'] = date(DATE_ATOM, (int)($entryForJson['date']->toDateTime()->format('U')));
    }

    // Add an _id for fallback storage
    $entryForJson['_id'] = bin2hex(random_bytes(12));
    array_unshift($existing, $entryForJson);
    file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    if ($inserted) {
        // If inserted into MongoDB, redirect to frontend
        header('Location: ../../frontend/?page=articles');
        exit;
    } else {
        // If not inserted, still redirect but include a warning query
        header('Location: ../../frontend/?page=articles&warning=fb');
        exit;
    }

} catch (Throwable $e) {
    http_response_code(500);
    error_log('Upload article error: ' . $e->getMessage());
    echo 'Error: ' . $e->getMessage();
    exit;
}
