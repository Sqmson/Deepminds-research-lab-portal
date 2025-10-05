<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Driver\Exception\Exception as MongoException;

class Database {
    private static $instance = null;
    private $client;
    private $database;

    private function __construct() {
        try {
            $mongoUri = getenv('MONGO_URI') ?: 'mongodb://localhost:27017';
            $databaseName = getenv('DB_NAME') ?: 'deepminds_research_lab';

            $this->client = new Client($mongoUri);
            $this->database = $this->client->selectDatabase($databaseName);

            // Test connection
            $this->database->listCollections();

        } catch (MongoException $e) {
            error_log('MongoDB connection error: ' . $e->getMessage());
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getDatabase() {
        return $this->database;
    }

    public function getCollection($collectionName) {
        return $this->database->selectCollection($collectionName);
    }
}
?>