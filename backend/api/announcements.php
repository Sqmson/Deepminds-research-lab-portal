<?php
// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/AnnouncementController.php';

$controller = new AnnouncementController();
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parse the request path
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/api/announcements', '', $path);

// Remove query string if present
$path = explode('?', $path)[0];

try {
    switch ($method) {
        case 'GET':
            if ($path === '' || $path === '/') {
                $controller->getAnnouncements();
            } elseif (preg_match('/^\/([a-f0-9]{24})$/', $path, $matches)) {
                $controller->getAnnouncement($matches[1]);
            } else {
                throw new Exception('Invalid endpoint');
            }
            break;

        case 'POST':
            if ($path === '' || $path === '/') {
                $controller->createAnnouncement();
            } else {
                throw new Exception('Invalid endpoint for POST');
            }
            break;

        case 'PUT':
            if (preg_match('/^\/([a-f0-9]{24})$/', $path, $matches)) {
                $controller->updateAnnouncement($matches[1]);
            } else {
                throw new Exception('Invalid endpoint for PUT');
            }
            break;

        case 'DELETE':
            if (preg_match('/^\/([a-f0-9]{24})$/', $path, $matches)) {
                $controller->deleteAnnouncement($matches[1]);
            } else {
                throw new Exception('Invalid endpoint for DELETE');
            }
            break;

        default:
            http_response_code(405);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error' => 'Method not allowed'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
