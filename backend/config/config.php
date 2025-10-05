<?php
// API Configuration
define('YOUTUBE_API_KEY', getenv('YOUTUBE_API_KEY') ?: '');
define('YOUTUBE_CHANNEL_ID', getenv('YOUTUBE_CHANNEL_ID') ?: '');
define('CLOUDINARY_CLOUD_NAME', getenv('CLOUDINARY_CLOUD_NAME') ?: '');
define('CLOUDINARY_API_KEY', getenv('CLOUDINARY_API_KEY') ?: '');
define('CLOUDINARY_API_SECRET', getenv('CLOUDINARY_API_SECRET') ?: '');

// Database Configuration
define('DB_NAME', getenv('DB_NAME') ?: 'deepminds_research_lab');
define('ARTICLES_COLLECTION', 'articles');
define('VIDEOS_COLLECTION', 'videos');
define('MEMBERS_COLLECTION', 'members');
define('ANNOUNCEMENTS_COLLECTION', 'announcements');

// API Response Headers
define('CACHE_CONTROL_HEADER', 'Cache-Control: public, max-age=300'); // 5 minutes cache
define('CONTENT_TYPE_JSON', 'Content-Type: application/json');
define('CORS_HEADERS', 'Access-Control-Allow-Origin: *');

// Error Messages
define('ERROR_INVALID_REQUEST', 'Invalid request');
define('ERROR_DATABASE_ERROR', 'Database operation failed');
define('ERROR_NOT_FOUND', 'Resource not found');
define('ERROR_VALIDATION_FAILED', 'Validation failed');

// Pagination Defaults
define('DEFAULT_PAGE', 1);
define('DEFAULT_LIMIT', 10);
define('MAX_LIMIT', 50);

// YouTube API Settings
define('YOUTUBE_MAX_RESULTS', 50);

// Security Settings
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
?>