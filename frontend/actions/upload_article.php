<?php
// Proxy action for frontend form to call backend upload_article.php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}
// Resolve backend handler path: prefer project-relative, fall back to absolute path in Apache docroot
$backend = dirname(__DIR__, 2) . '/backend/api/upload_article.php';
@file_put_contents('/tmp/action_debug.log', "Computed backend path: $backend\n", FILE_APPEND);
if (!file_exists($backend)) {
    $alt = '/var/www/html/deepminds/backend/api/upload_article.php';
    @file_put_contents('/tmp/action_debug.log', "Trying alt: $alt\n", FILE_APPEND);
    if (file_exists($alt)) {
        $backend = $alt;
    }
}
@file_put_contents('/tmp/action_debug.log', "Final backend path used: $backend\n", FILE_APPEND);
if (!file_exists($backend)) {
    http_response_code(500);
    echo 'Backend handler not found: ' . htmlspecialchars($backend);
    exit;
}
require $backend;
header('Location: /?page=articles');
exit;
