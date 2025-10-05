<?php
require_once __DIR__ . '/mongo.php';

class Database {
    private static $instance = null;
    private $client;
    private $dbName;

    private function __construct() {
        $this->client = connectMongoDB();
        // Use DB_NAME from env or default
        $this->dbName = getenv('MONGO_DB') ?: ($_ENV['MONGO_DB'] ?? 'deepminds');
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getClient() {
        return $this->client;
    }

    public function getCollection($name) {
        return $this->client->{$this->dbName}->{$name};
    }
}

?>
