<?php
// Frontend-facing uploader that proxies to backend handler file using absolute path
$backend = __DIR__ . '/../backend/api/upload_article.php';
$alt = '/var/www/html/deepminds/backend/api/upload_article.php';
if (file_exists($alt)) {
    $backend = $alt;
}
if (!file_exists($backend)) {
    http_response_code(500);
    echo 'Backend handler missing';
    exit;
}
require $backend;
