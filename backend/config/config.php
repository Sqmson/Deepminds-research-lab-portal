<?php
// Application configuration defaults used by models and controllers

// Pagination defaults
if (!defined('DEFAULT_PAGE')) define('DEFAULT_PAGE', 1);
if (!defined('DEFAULT_LIMIT')) define('DEFAULT_LIMIT', 12);
if (!defined('MAX_LIMIT')) define('MAX_LIMIT', 100);

// HTTP headers
if (!defined('CONTENT_TYPE_JSON')) define('CONTENT_TYPE_JSON', 'Content-Type: application/json');
if (!defined('CACHE_CONTROL_HEADER')) define('CACHE_CONTROL_HEADER', 'Cache-Control: no-cache, no-store, must-revalidate');
if (!defined('CORS_HEADERS')) define('CORS_HEADERS', 'Access-Control-Allow-Origin: *');

// MongoDB collection names
if (!defined('ARTICLES_COLLECTION')) define('ARTICLES_COLLECTION', 'articles');
if (!defined('ANNOUNCEMENTS_COLLECTION')) define('ANNOUNCEMENTS_COLLECTION', 'announcements');

// Error constants
if (!defined('ERROR_NOT_FOUND')) define('ERROR_NOT_FOUND', 'Not found');
if (!defined('ERROR_DATABASE_ERROR')) define('ERROR_DATABASE_ERROR', 'Database error');
if (!defined('ERROR_INVALID_REQUEST')) define('ERROR_INVALID_REQUEST', 'Invalid request');

?>
