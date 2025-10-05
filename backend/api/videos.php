<?php
// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/VideoController.php';

$controller = new VideoController();
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parse the request path
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api/videos', '', $path);

// Remove query string if present
$path = explode('?', $path)[0];

try {
    switch ($method) {
        case 'GET':
            if ($path === '' || $path === '/') {
                $controller->getVideos();
            } elseif (preg_match('/^\/([a-zA-Z0-9_-]+)$/', $path, $matches)) {
                // YouTube video IDs are typically 11 characters with letters, numbers, underscores, hyphens
                $controller->getVideo($matches[1]);
            } else {
                throw new Exception('Invalid endpoint');
            }
            break;

        default:
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => 'Method not allowed'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>