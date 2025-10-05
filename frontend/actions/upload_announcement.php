<?php
// This script proxies the frontend upload form to the backend API endpoint so the form
// can use a relative frontend path. It accepts POST and FILES and forwards them.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
}

$backendUrl = dirname(__DIR__, 1) . '/backend/api/upload_announcements.php';

// Move uploaded file to a temporary location to attach to the backend script via include
// We'll reuse PHP's globals by setting $_FILES and $_POST and including the backend script.

// Ensure backend script path exists and is readable
if (!file_exists($backendUrl)) {
    http_response_code(500);
    echo 'Backend upload handler not found';
    exit;
}

// Include the backend handler which expects $_POST and $_FILES to be present
require $backendUrl;

// After backend handler runs it issues a header redirect. If it didn't, redirect back to lobby.
header('Location: /?page=lobby');
exit;
