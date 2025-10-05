<?php
require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;
use MongoDB\Driver\ServerApi;
function loadEnvFile(string $envPath): void
{
    if (!file_exists($envPath)) {
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        if (strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        // Remove surrounding quotes if present
        $value = trim($value, "\"' ");
        if (!getenv($key)) {
            putenv("{$key}={$value}");
        }
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

function connectMongoDB(): Client
{
    // Load .env located in project root (one level up from config)
    $envPath = __DIR__ . '/../.env';
    loadEnvFile($envPath);

    $mongoUri = getenv('MONGO_URI') ?: ($_ENV['MONGO_URI'] ?? null);
    if (empty($mongoUri)) {
        throw new RuntimeException('MONGO_URI not set. Please add MONGO_URI to your environment or the .env file.');
    }

    // Some environments (Apache FPM / mod_php) may not have the mongodb PHP extension
    // available while the CLI does. Only set the serverApi option if the ServerApi
    // class exists in this SAPI to avoid fatal errors.
    $clientOptions = [];
    if (class_exists('MongoDB\\Driver\\ServerApi')) {
        $apiVersion = new ServerApi(ServerApi::V1);
        $clientOptions['serverApi'] = $apiVersion;
    }

    return new Client($mongoUri, [], $clientOptions);
}
