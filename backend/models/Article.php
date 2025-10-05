<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

class Article {
    private $collection;

    public function __construct() {
        $db = Database::getInstance();
        $this->collection = $db->getCollection(ARTICLES_COLLECTION);
    }

    /**
     * Get all articles with optional filtering and pagination
     */
    public function getAll($filters = [], $page = DEFAULT_PAGE, $limit = DEFAULT_LIMIT) {
        try {
            $options = [
                'sort' => ['date' => -1],
                'skip' => ($page - 1) * $limit,
                'limit' => $limit
            ];

            $query = [];

            // Apply category filter
            if (!empty($filters['category']) && $filters['category'] !== 'all') {
                $query['category'] = $filters['category'];
            }

            // Apply search filter
            if (!empty($filters['search'])) {
                $query['$or'] = [
                    ['title' => new MongoDB\BSON\Regex($filters['search'], 'i')],
                    ['excerpt' => new MongoDB\BSON\Regex($filters['search'], 'i')],
                    ['author' => new MongoDB\BSON\Regex($filters['search'], 'i')],
                    ['tags' => new MongoDB\BSON\Regex($filters['search'], 'i')]
                ];
            }

            $cursor = $this->collection->find($query, $options);
            $articles = iterator_to_array($cursor);

            // Convert MongoDB objects to arrays
            $result = [];
            foreach ($articles as $article) {
                $result[] = [
                    '_id' => (string)$article['_id'],
                    'title' => $article['title'] ?? '',
                    'excerpt' => $article['excerpt'] ?? '',
                    'author' => $article['author'] ?? '',
                    'date' => $article['date'] ?? null,
                    'category' => $article['category'] ?? '',
                    'views' => $article['views'] ?? '0',
                    'tags' => $article['tags'] ?? [],
                    'image_url' => $article['image_url'] ?? ''
                ];
            }

            return $result;

        } catch (Exception $e) {
            error_log('Error fetching articles: ' . $e->getMessage());
            throw new Exception(ERROR_DATABASE_ERROR);
        }
    }

    /**
     * Get single article by ID
     */
    public function getById($id) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            $article = $this->collection->findOne(['_id' => $objectId]);

            if (!$article) {
                throw new Exception(ERROR_NOT_FOUND);
            }

            return [
                '_id' => (string)$article['_id'],
                'title' => $article['title'] ?? '',
                'excerpt' => $article['excerpt'] ?? '',
                'author' => $article['author'] ?? '',
                'date' => $article['date'] ?? null,
                'category' => $article['category'] ?? '',
                'views' => $article['views'] ?? '0',
                'tags' => $article['tags'] ?? [],
                'image_url' => $article['image_url'] ?? '',
                'content' => $article['content'] ?? ''
            ];

        } catch (Exception $e) {
            error_log('Error fetching article by ID: ' . $e->getMessage());
            throw new Exception($e->getMessage() === ERROR_NOT_FOUND ? ERROR_NOT_FOUND : ERROR_DATABASE_ERROR);
        }
    }

    /**
     * Create new article
     */
    public function create($data) {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['content'])) {
                throw new Exception('Title and content are required');
            }

            $article = [
                'title' => htmlspecialchars(trim($data['title'])),
                'excerpt' => htmlspecialchars(trim($data['excerpt'] ?? '')),
                'content' => htmlspecialchars(trim($data['content'])),
                'author' => htmlspecialchars(trim($data['author'] ?? '')),
                'date' => new MongoDB\BSON\UTCDateTime(),
                'category' => htmlspecialchars(trim($data['category'] ?? '')),
                'views' => '0',
                'tags' => array_map('htmlspecialchars', $data['tags'] ?? []),
                'image_url' => htmlspecialchars(trim($data['image_url'] ?? ''))
            ];

            $result = $this->collection->insertOne($article);

            if ($result->getInsertedCount() === 0) {
                throw new Exception('Failed to create article');
            }

            return [
                '_id' => (string)$result->getInsertedId(),
                ...$article
            ];

        } catch (Exception $e) {
            error_log('Error creating article: ' . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    /**
     * Get categories
     */
    public function getCategories() {
        try {
            $categories = $this->collection->distinct('category');
            return array_filter($categories); // Remove empty values
        } catch (Exception $e) {
            error_log('Error fetching categories: ' . $e->getMessage());
            return [];
        }
    }
}
?>