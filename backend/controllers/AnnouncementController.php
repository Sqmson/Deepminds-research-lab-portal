<?php
require_once __DIR__ . '/../models/Announcement.php';

class AnnouncementController {
    private $announcementModel;

    public function __construct() {
        $this->announcementModel = new Announcement();
    }

    /**
     * Handle GET /api/announcements
     */
    public function getAnnouncements() {
        try {
            $page = (int)($_GET['page'] ?? DEFAULT_PAGE);
            $limit = (int)($_GET['limit'] ?? DEFAULT_LIMIT);
            $status = $_GET['status'] ?? 'all';

            // Validate pagination parameters
            $page = max(1, $page);
            $limit = min(MAX_LIMIT, max(1, $limit));

            $filters = [];
            if ($status !== 'all') {
                $filters['status'] = $status;
            }

            $announcements = $this->announcementModel->getAll($filters, $page, $limit);

            // Set cache headers
            header('Cache-Control: public, max-age=300'); // 5 minutes
            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');

            echo json_encode([
                'success' => true,
                'data' => $announcements,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => count($announcements)
                ]
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage());
        }
    }

    /**
     * Handle GET /api/announcements/:id
     */
    public function getAnnouncement($id) {
        try {
            if (empty($id)) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $announcement = $this->announcementModel->getById($id);

            // Set cache headers
            header('Cache-Control: public, max-age=300');
            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');

            echo json_encode([
                'success' => true,
                'data' => $announcement
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), $e->getMessage() === ERROR_NOT_FOUND ? 404 : 500);
        }
    }

    /**
     * Handle POST /api/announcements
     */
    public function createAnnouncement() {
        try {
            // Check authentication (simplified for now)
            if (!$this->isAuthenticated()) {
                throw new Exception('Authentication required', 401);
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            // Validate required fields
            if (empty($input['title']) || empty($input['content'])) {
                throw new Exception('Title and content are required');
            }

            $announcement = $this->announcementModel->create($input);

            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');
            http_response_code(201);

            echo json_encode([
                'success' => true,
                'data' => $announcement,
                'message' => 'Announcement created successfully'
            ]);

        } catch (Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            $this->sendErrorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * Handle PUT /api/announcements/:id
     */
    public function updateAnnouncement($id) {
        try {
            // Check authentication
            if (!$this->isAuthenticated()) {
                throw new Exception('Authentication required', 401);
            }

            if (empty($id)) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $announcement = $this->announcementModel->update($id, $input);

            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');

            echo json_encode([
                'success' => true,
                'data' => $announcement,
                'message' => 'Announcement updated successfully'
            ]);

        } catch (Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            $this->sendErrorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * Handle DELETE /api/announcements/:id
     */
    public function deleteAnnouncement($id) {
        try {
            // Check authentication
            if (!$this->isAuthenticated()) {
                throw new Exception('Authentication required', 401);
            }

            if (empty($id)) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $this->announcementModel->delete($id);

            header('Content-Type: application/json; charset=utf-8');
            header('Access-Control-Allow-Origin: *');

            echo json_encode([
                'success' => true,
                'message' => 'Announcement deleted successfully'
            ]);

        } catch (Exception $e) {
            $statusCode = $e->getCode() ?: 400;
            $this->sendErrorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * Simple authentication check (replace with proper auth system)
     */
    private function isAuthenticated() {
        // For now, check for a simple API key in headers
        $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
        return $apiKey === 'admin-key-123'; // Replace with proper authentication
    }

    /**
     * Send error response
     */
    private function sendErrorResponse($message, $statusCode = 500) {
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        http_response_code($statusCode);

        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }
}
?>
