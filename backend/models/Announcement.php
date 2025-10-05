<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

class Announcement {
    private $collection;

    public function __construct() {
        $db = Database::getInstance();
        $this->collection = $db->getCollection(ANNOUNCEMENTS_COLLECTION);
    }

    /**
     * Get all announcements with optional filtering and pagination
     */
    public function getAll($filters = [], $page = DEFAULT_PAGE, $limit = DEFAULT_LIMIT) {
        try {
            $options = [
                'sort' => ['created_at' => -1],
                'skip' => ($page - 1) * $limit,
                'limit' => $limit
            ];

            $query = [];

            // Apply status filter
            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query['status'] = $filters['status'];
            }

            $cursor = $this->collection->find($query, $options);
            $announcements = iterator_to_array($cursor);

            // Convert MongoDB objects to arrays
            $result = [];
            foreach ($announcements as $announcement) {
                $result[] = [
                    '_id' => (string)$announcement['_id'],
                    'title' => $announcement['title'] ?? '',
                    'content' => $announcement['content'] ?? '',
                    'type' => $announcement['type'] ?? 'general',
                    'status' => $announcement['status'] ?? 'active',
                    'priority' => $announcement['priority'] ?? 'normal',
                    'created_at' => $announcement['created_at'] ?? null,
                    'updated_at' => $announcement['updated_at'] ?? null,
                    'expires_at' => $announcement['expires_at'] ?? null,
                    'author' => $announcement['author'] ?? 'Admin'
                ];
            }

            return $result;

        } catch (Exception $e) {
            error_log('Error fetching announcements: ' . $e->getMessage());
            throw new Exception(ERROR_DATABASE_ERROR);
        }
    }

    /**
     * Get single announcement by ID
     */
    public function getById($id) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            $announcement = $this->collection->findOne(['_id' => $objectId]);

            if (!$announcement) {
                throw new Exception(ERROR_NOT_FOUND);
            }

            return [
                '_id' => (string)$announcement['_id'],
                'title' => $announcement['title'] ?? '',
                'content' => $announcement['content'] ?? '',
                'type' => $announcement['type'] ?? 'general',
                'status' => $announcement['status'] ?? 'active',
                'priority' => $announcement['priority'] ?? 'normal',
                'created_at' => $announcement['created_at'] ?? null,
                'updated_at' => $announcement['updated_at'] ?? null,
                'expires_at' => $announcement['expires_at'] ?? null,
                'author' => $announcement['author'] ?? 'Admin'
            ];

        } catch (Exception $e) {
            error_log('Error fetching announcement by ID: ' . $e->getMessage());
            throw new Exception($e->getMessage() === ERROR_NOT_FOUND ? ERROR_NOT_FOUND : ERROR_DATABASE_ERROR);
        }
    }

    /**
     * Create new announcement
     */
    public function create($data) {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['content'])) {
                throw new Exception('Title and content are required');
            }

            $announcement = [
                'title' => htmlspecialchars(trim($data['title'])),
                'content' => htmlspecialchars(trim($data['content'])),
                'type' => htmlspecialchars(trim($data['type'] ?? 'general')),
                'status' => htmlspecialchars(trim($data['status'] ?? 'active')),
                'priority' => htmlspecialchars(trim($data['priority'] ?? 'normal')),
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime(),
                'expires_at' => !empty($data['expires_at']) ? new MongoDB\BSON\UTCDateTime(strtotime($data['expires_at']) * 1000) : null,
                'author' => htmlspecialchars(trim($data['author'] ?? 'Admin'))
            ];

            $result = $this->collection->insertOne($announcement);

            if ($result->getInsertedCount() === 0) {
                throw new Exception('Failed to create announcement');
            }

            return [
                '_id' => (string)$result->getInsertedId(),
                ...$announcement
            ];

        } catch (Exception $e) {
            error_log('Error creating announcement: ' . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    /**
     * Update announcement
     */
    public function update($id, $data) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            
            // Check if announcement exists
            $existing = $this->collection->findOne(['_id' => $objectId]);
            if (!$existing) {
                throw new Exception(ERROR_NOT_FOUND);
            }

            $updateData = [
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];

            if (isset($data['title'])) {
                $updateData['title'] = htmlspecialchars(trim($data['title']));
            }
            if (isset($data['content'])) {
                $updateData['content'] = htmlspecialchars(trim($data['content']));
            }
            if (isset($data['type'])) {
                $updateData['type'] = htmlspecialchars(trim($data['type']));
            }
            if (isset($data['status'])) {
                $updateData['status'] = htmlspecialchars(trim($data['status']));
            }
            if (isset($data['priority'])) {
                $updateData['priority'] = htmlspecialchars(trim($data['priority']));
            }
            if (isset($data['expires_at'])) {
                $updateData['expires_at'] = !empty($data['expires_at']) 
                    ? new MongoDB\BSON\UTCDateTime(strtotime($data['expires_at']) * 1000) 
                    : null;
            }
            if (isset($data['author'])) {
                $updateData['author'] = htmlspecialchars(trim($data['author']));
            }

            $result = $this->collection->updateOne(
                ['_id' => $objectId],
                ['$set' => $updateData]
            );

            if ($result->getModifiedCount() === 0) {
                throw new Exception('Failed to update announcement');
            }

            return $this->getById($id);

        } catch (Exception $e) {
            error_log('Error updating announcement: ' . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    /**
     * Delete announcement
     */
    public function delete($id) {
        try {
            $objectId = new MongoDB\BSON\ObjectId($id);
            
            $result = $this->collection->deleteOne(['_id' => $objectId]);

            if ($result->getDeletedCount() === 0) {
                throw new Exception(ERROR_NOT_FOUND);
            }

            return true;

        } catch (Exception $e) {
            error_log('Error deleting announcement: ' . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
}
?>
