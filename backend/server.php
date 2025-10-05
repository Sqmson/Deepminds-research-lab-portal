<?php
// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load environment variables if using .env file
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = parse_ini_file(__DIR__ . '/.env');
    foreach ($dotenv as $key => $value) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

// Autoload classes (if using Composer)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Include configuration
require_once __DIR__ . '/config/config.php';

// Basic routing for API endpoints
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI
$path = parse_url($requestUri, PHP_URL_PATH);

// Set CORS headers for all requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// API routing
if (strpos($path, '/api/articles') === 0) {
    require_once __DIR__ . '/api/articles.php';
    exit();
}

if (strpos($path, '/api/videos') === 0) {
    require_once __DIR__ . '/api/videos.php';
    exit();
}

if (strpos($path, '/api/announcements') === 0) {
    require_once __DIR__ . '/api/announcements.php';
    exit();
}

// Health check endpoint
if ($path === '/health' && $requestMethod === 'GET') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('c'),
        'version' => '1.0.0'
    ]);
    exit();
}

// Default response for unmatched routes
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'success' => false,
    'error' => 'Endpoint not found',
    'available_endpoints' => [
        'GET /api/articles',
        'GET /api/articles/categories',
        'GET /api/articles/{id}',
        'POST /api/articles',
        'GET /api/videos',
        'GET /api/videos/{id}',
        'GET /health'
    ]
]);
?>