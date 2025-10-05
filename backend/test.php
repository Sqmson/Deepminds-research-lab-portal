<?php
require_once __DIR__ . '/config/mongo.php';

try {
    $client = connectMongoDB();
    $client->selectDatabase('admin')->command(['ping' => 1]);
    echo "✅ Pinged your deployment. You successfully connected to MongoDB!" . PHP_EOL;
} catch (Throwable $e) {
    // Return non-zero exit code when run from CLI and detailed message for debugging
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, "❌ Connection failed: " . $e->getMessage() . PHP_EOL);
        exit(1);
    }
    http_response_code(500);
    echo "❌ Connection failed: " . $e->getMessage();
}
