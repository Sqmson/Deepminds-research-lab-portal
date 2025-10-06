<?php
/**
 * Simple Cloudinary helper using the REST API.
 * Reads CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET from env.
 */

function cloudinary_upload_file(string $localPath, string $originalFilename, string $folder = ''): array {
    $cloudName = getenv('CLOUDINARY_CLOUD_NAME') ?: ($_ENV['CLOUDINARY_CLOUD_NAME'] ?? null);
    $apiKey = getenv('CLOUDINARY_API_KEY') ?: ($_ENV['CLOUDINARY_API_KEY'] ?? null);
    $apiSecret = getenv('CLOUDINARY_API_SECRET') ?: ($_ENV['CLOUDINARY_API_SECRET'] ?? null);

    if (!$cloudName || !$apiKey || !$apiSecret) {
        return ['success' => false, 'error' => 'Cloudinary not configured'];
    }

    // Use the official Cloudinary SDK
    try {
        // Lazy-load vendor autoload if not already
        if (!class_exists('\Cloudinary\Cloudinary')) {
            require_once __DIR__ . '/../vendor/autoload.php';
        }

        $config = [
            'cloud' => [
                'cloud_name' => $cloudName,
                'api_key'    => $apiKey,
                'api_secret' => $apiSecret,
            ],
            'url' => [
                'secure' => true
            ]
        ];

        $cloudinary = new \Cloudinary\Cloudinary($config);

        $options = [];
        if (!empty($folder)) {
            $options['folder'] = $folder;
        }

        $uploadResult = $cloudinary->uploadApi()->upload($localPath, $options);

        if (!empty($uploadResult['secure_url'])) {
            return ['success' => true, 'url' => $uploadResult['secure_url'], 'raw' => $uploadResult];
        }

        return ['success' => false, 'error' => 'Cloudinary upload returned no URL', 'raw' => $uploadResult];

    } catch (Throwable $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}


?>
