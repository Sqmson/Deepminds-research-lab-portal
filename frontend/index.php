<?php
// Get current page from URL parameter or default to lobby
$page = $_GET['page'] ?? 'lobby';

// Validate page parameter to prevent directory traversal
$allowedPages = ['lobby', 'articles', 'article', 'videos', 'video'];
if (!in_array($page, $allowedPages)) {
    $page = 'lobby';
}

// Set page title based on current page
$pageTitles = [
    'lobby' => 'DeepMinds Research Lab',
    'articles' => 'Articles - DeepMinds Research Lab',
    'article' => 'Article - DeepMinds Research Lab',
    'videos' => 'Videos - DeepMinds Research Lab',
    'video' => 'Video - DeepMinds Research Lab'
];

$currentTitle = $pageTitles[$page] ?? 'DeepMinds Research Lab';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($currentTitle); ?></title>

    <!-- Preload critical resources -->
    <link rel="preload" href="/css/global.css" as="style">
    <link rel="preload" href="/js/api.js" as="script">
    <link rel="preload" href="/js/ui.js" as="script">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/logo-7402580_1920.png">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/global.css">
    <link rel="stylesheet" href="/css/style.css">

    <!-- Open Graph meta tags for social sharing -->
    <meta property="og:title" content="<?php echo htmlspecialchars($currentTitle); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo htmlspecialchars($_SERVER['REQUEST_URI']); ?>">
    <meta property="og:description" content="DeepMinds Research Lab - Machine Learning Research and Education">
</head>
<body>
    <div class="app">
        <?php include 'header.php'; ?>

        <main class="main-content">
            <?php
            // Include the appropriate page content
            $pageFile = "pages/{$page}.php";
            if (file_exists($pageFile)) {
                include $pageFile;
            } else {
                include 'pages/lobby.php'; // Fallback to lobby
            }
            ?>
        </main>

        <?php include 'footer.php'; ?>
    </div>

    <!-- JavaScript modules -->
    <script src="/js/api.js"></script>
    <script src="/js/ui.js"></script>

    <!-- Page-specific JavaScript -->
    <?php
    $pageJsFile = "/js/pages/{$page}.js";
    if (file_exists(__DIR__ . $pageJsFile)) {
        echo "<script src=\"{$pageJsFile}\"></script>";
    }
    ?>

    <!-- Service Worker for caching (optional enhancement) -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                        console.log('ServiceWorker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                        console.warn('ServiceWorker registration failed:', error);
                    });
            });
        } else {
            console.log('ServiceWorker not supported in this browser');
        }
    </script>
</body>
</html>