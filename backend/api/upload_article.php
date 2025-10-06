<?php
require_once __DIR__ . '/../vendor/autoload.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    @file_put_contents('/tmp/upload_article_debug.log', "=== start request at " . date('c') . "\n", FILE_APPEND);
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

            // Try Cloudinary via helper
            @file_put_contents('/tmp/upload_article_debug.log', "trying cloudinary helper\n", FILE_APPEND);
            require_once __DIR__ . '/../config/cloudinary.php';
            $cloudRes = cloudinary_upload_file($tmpPath, basename($_FILES['image']['name']), 'articles');
            @file_put_contents('/tmp/upload_article_debug.log', "cloudRes: " . json_encode($cloudRes) . "\n", FILE_APPEND);
            if (!empty($cloudRes['success'])) {
                $cloudinaryUrl = $cloudRes['url'];
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

    // Build article entry (use ISO date string here; Article model will convert to BSON when inserting)
    $entry = [
        'title' => $title,
        'excerpt' => $excerpt,
        'content' => $content,
        'author' => $author,
        'category' => $category,
        'tags' => $tags,
        'image_url' => $cloudinaryUrl ?: $fileUrl,
        'date' => date(DATE_ATOM)
    ];

    $inserted = false;
    try {
        @file_put_contents('/tmp/upload_article_debug.log', "about to insert into MongoDB\n", FILE_APPEND);
        // Try to insert into MongoDB using the model
        require_once __DIR__ . '/../models/Article.php';
        // The Article model expects sanitized input and will insert the document
        $articleModel = new Article();
        $created = $articleModel->create($entry);
        $inserted = true;
    } catch (Throwable $e) {
        error_log('Article insert to MongoDB failed: ' . $e->getMessage());
        @file_put_contents('/tmp/upload_article_debug.log', "mongo insert failed: " . $e->getMessage() . "\n", FILE_APPEND);
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

    // Normalize date for JSON fallback (ensure ISO string)
    $entryForJson = $entry;
    if (!is_string($entryForJson['date'])) {
        $entryForJson['date'] = date(DATE_ATOM);
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
    @file_put_contents('/tmp/upload_article_debug.log', "fatal error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo 'Error: ' . $e->getMessage();
    exit;
}
