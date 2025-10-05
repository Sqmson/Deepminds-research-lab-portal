<?php
require_once __DIR__ . '/../models/Video.php';

class VideoController {
    private $videoModel;

    public function __construct() {
        $this->videoModel = new Video();
    }

    /**
     * Handle GET /api/videos
     */
    public function getVideos() {
        try {
            $search = $_GET['search'] ?? null;
            $maxResults = (int)($_GET['limit'] ?? YOUTUBE_MAX_RESULTS);
            $maxResults = min(50, max(1, $maxResults)); // Limit to reasonable range

            if ($search) {
                $videos = $this->videoModel->search($search, $maxResults);
            } else {
                $videos = $this->videoModel->getAll($maxResults);
            }

            // Set cache headers (shorter cache for dynamic content)
            header('Cache-Control: public, max-age=600'); // 10 minutes
            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);

            echo json_encode([
                'success' => true,
                'data' => $videos,
                'count' => count($videos)
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage());
        }
    }

    /**
     * Handle GET /api/videos/:id
     */
    public function getVideo($id) {
        try {
            if (empty($id)) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $video = $this->videoModel->getById($id);

            // Set cache headers
            header('Cache-Control: public, max-age=1800'); // 30 minutes for individual videos
            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);

            echo json_encode([
                'success' => true,
                'data' => $video
            ]);

        } catch (Exception $e) {
            $statusCode = $e->getMessage() === ERROR_NOT_FOUND ? 404 : 500;
            $this->sendErrorResponse($e->getMessage(), $statusCode);
        }
    }

    /**
     * Send error response
     */
    private function sendErrorResponse($message, $statusCode = 500) {
        header(CONTENT_TYPE_JSON);
        header(CORS_HEADERS);
        http_response_code($statusCode);

        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }
}
?>