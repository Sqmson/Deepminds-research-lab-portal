<?php
require_once __DIR__ . '/../models/Article.php';

class ArticleController {
    private $articleModel;

    public function __construct() {
        $this->articleModel = new Article();
    }

    /**
     * Handle GET /api/articles
     */
    public function getArticles() {
        try {
            $category = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            $page = (int)($_GET['page'] ?? DEFAULT_PAGE);
            $limit = (int)($_GET['limit'] ?? DEFAULT_LIMIT);

            // Validate pagination parameters
            $page = max(1, $page);
            $limit = min(MAX_LIMIT, max(1, $limit));

            $filters = [];
            if ($category) $filters['category'] = $category;
            if ($search) $filters['search'] = $search;

            $articles = $this->articleModel->getAll($filters, $page, $limit);

            // Set cache headers
            header(CACHE_CONTROL_HEADER);
            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);

            echo json_encode([
                'success' => true,
                'data' => $articles,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => count($articles) // In a real app, you'd get total count separately
                ]
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage());
        }
    }

    /**
     * Handle GET /api/articles/:id
     */
    public function getArticle($id) {
        try {
            if (empty($id)) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $article = $this->articleModel->getById($id);

            // Set cache headers
            header(CACHE_CONTROL_HEADER);
            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);

            echo json_encode([
                'success' => true,
                'data' => $article
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), $e->getMessage() === ERROR_NOT_FOUND ? 404 : 500);
        }
    }

    /**
     * Handle POST /api/articles
     */
    public function createArticle() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                throw new Exception(ERROR_INVALID_REQUEST);
            }

            $article = $this->articleModel->create($input);

            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);
            http_response_code(201);

            echo json_encode([
                'success' => true,
                'data' => $article,
                'message' => 'Article created successfully'
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Handle GET /api/articles/categories
     */
    public function getCategories() {
        try {
            $categories = $this->articleModel->getCategories();

            // Set cache headers (longer cache for categories)
            header('Cache-Control: public, max-age=3600'); // 1 hour
            header(CONTENT_TYPE_JSON);
            header(CORS_HEADERS);

            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);

        } catch (Exception $e) {
            $this->sendErrorResponse($e->getMessage());
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