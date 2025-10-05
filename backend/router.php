<?php
// Router for PHP built-in server
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Handle API routes
if (strpos($path, '/api/') === 0) {
    // Serve the API through server.php
    $_SERVER['SCRIPT_NAME'] = '/server.php';
    require_once __DIR__ . '/server.php';
    return true;
}

// Handle health check
if ($path === '/health') {
    $_SERVER['SCRIPT_NAME'] = '/server.php';
    require_once __DIR__ . '/server.php';
    return true;
}

// For all other requests, return false to let PHP serve files normally
return false;
?>
