<?php
// Determine the current page from URL or default to lobby
$page = $_GET['page'] ?? 'lobby';

// Allow only specific pages to prevent unauthorized access
$allowedPages = ['lobby', 'articles', 'article', 'videos', 'video'];
if (!in_array($page, $allowedPages)) {
    $page = 'lobby';
}

// Set page title based on current page
$pageTitles = [
    'lobby' => 'Deepminds Research Lab',
    'articles' => 'Deepminds Research Lab - Articles',
    'article' => 'Deepminds Research Lab - Article',
    'videos' => 'Deepminds Research Lab - videos',
    'video' => 'Deepminds Research Lab - video'
];

$currentTitle = $pageTitles[$page] ?? 'DeepMinds Research Lab';

// If the upload article form posts to this page, include the backend handler before rendering
if ($page === 'upload_article' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $backendHandler = __DIR__ . '/../backend/api/upload_article.php';
    $alt = '/var/www/html/deepminds/backend/api/upload_article.php';
    if (file_exists($alt)) $backendHandler = $alt;
    if (file_exists($backendHandler)) {
        require_once $backendHandler;
        // backend handler will redirect on success, so exit to avoid double render
        exit;
    } else {
        // log missing handler
        error_log('Upload article backend handler not found: ' . $backendHandler);
    }
}

// Attempt to load announcements from backend MongoDB; if unavailable, fall back to a local JSON file
$announcements = [];
try {
    require_once __DIR__ . '/../backend/config/mongo.php';
    $db = connectMongoDB();
    // Only proceed if the client supports selectCollection signature (some environments may differ)
    if (method_exists($db, 'selectCollection')) {
        $collection = $db->selectCollection('announcements');
        $cursor = $collection->find([], ['sort' => ['created_at' => -1]]);
        foreach ($cursor as $doc) {
            // Convert BSON document to PHP array for template compatibility
            if (is_array($doc)) {
                $announcements[] = $doc;
            } elseif (is_object($doc) && method_exists($doc, 'bsonSerialize')) {
                $announcements[] = $doc->bsonSerialize();
            } else {
                // Try cast
                $announcements[] = (array)$doc;
            }
        }
    }
} catch (Throwable $e) {
    // Fallback to JSON file produced by the upload handler
    $fallbackFile = __DIR__ . '/data/announcements.json';
    if (is_file($fallbackFile)) {
        $contents = @file_get_contents($fallbackFile);
        $arr = $contents ? json_decode($contents, true) : [];
        if (is_array($arr)) {
            $announcements = $arr;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($currentTitle); ?></title>

    <!-- Open Graph meta tags for social sharing -->
    <meta property="og:title" content="<?php echo htmlspecialchars($currentTitle); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo htmlspecialchars($_SERVER['REQUEST_URI']); ?>">
    <meta property="og:description" content="DeepMinds Research Lab - Machine Learning Research and Education">

    <link rel="icon" type="image/x-icon" href="public/logo-7402580_1920.png">

    <link rel="stylesheet" href="css/global.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/header.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/footer.css?v=<?php echo time(); ?>">

    <script src="js/router.js?v=<?php echo time(); ?>"></script>
    <script src="js/api.js"></script>
    <script src="js/ui.js"></script>
</head>
<body>
    <div class="app">
        <?php include 'pages/components/header.php'; ?>

        <main class="main-content">
            <?php include_once "pages/{$page}.php"; ?>
        </main>

        <?php include 'pages/components/footer.php'; ?>
    </div>
</body>
</html>