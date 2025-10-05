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