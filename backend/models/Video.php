<?php
require_once __DIR__ . '/../config/config.php';

class Video {
    private $youtubeApiKey;
    private $channelId;

    public function __construct() {
        $this->youtubeApiKey = YOUTUBE_API_KEY;
        $this->channelId = YOUTUBE_CHANNEL_ID;
    }

    /**
     * Get videos from YouTube API
     */
    public function getAll($maxResults = YOUTUBE_MAX_RESULTS) {
        try {
            if (empty($this->youtubeApiKey) || empty($this->channelId)) {
                // Return mock data for testing
                return $this->getMockVideos($maxResults);
            }

            $url = 'https://www.googleapis.com/youtube/v3/search?' . http_build_query([
                'key' => $this->youtubeApiKey,
                'channelId' => $this->channelId,
                'part' => 'snippet',
                'order' => 'date',
                'maxResults' => $maxResults,
                'type' => 'video'
            ]);

            $context = stream_context_create([
                'http' => [
                    'timeout' => 10,
                    'user_agent' => 'DeepMinds Research Lab API'
                ]
            ]);

            $response = file_get_contents($url, false, $context);

            if ($response === false) {
                throw new Exception('Failed to fetch from YouTube API');
            }

            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON response from YouTube API');
            }

            if (isset($data['error'])) {
                throw new Exception('YouTube API error: ' . $data['error']['message']);
            }

            $videos = [];
            foreach ($data['items'] as $item) {
                $videos[] = [
                    '_id' => $item['id']['videoId'],
                    'title' => $item['snippet']['title'],
                    'description' => $item['snippet']['description'],
                    'thumbnail' => $item['snippet']['thumbnails']['medium']['url'],
                    'author' => $item['snippet']['channelTitle'],
                    'uploadDate' => $item['snippet']['publishedAt'],
                    'category' => 'YouTube'
                ];
            }

            return $videos;

        } catch (Exception $e) {
            error_log('Error fetching YouTube videos: ' . $e->getMessage());
            throw new Exception('Failed to fetch videos: ' . $e->getMessage());
        }
    }

    /**
     * Get single video details from YouTube API
     */
    public function getById($videoId) {
        try {
            if (empty($this->youtubeApiKey)) {
                throw new Exception('YouTube API key not configured');
            }

            $url = 'https://www.googleapis.com/youtube/v3/videos?' . http_build_query([
                'key' => $this->youtubeApiKey,
                'id' => $videoId,
                'part' => 'snippet,contentDetails,statistics'
            ]);

            $context = stream_context_create([
                'http' => [
                    'timeout' => 10,
                    'user_agent' => 'DeepMinds Research Lab API'
                ]
            ]);

            $response = file_get_contents($url, false, $context);

            if ($response === false) {
                throw new Exception('Failed to fetch video details from YouTube API');
            }

            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON response from YouTube API');
            }

            if (isset($data['error'])) {
                throw new Exception('YouTube API error: ' . $data['error']['message']);
            }

            if (empty($data['items'])) {
                throw new Exception(ERROR_NOT_FOUND);
            }

            $video = $data['items'][0];
            $snippet = $video['snippet'];
            $statistics = $video['statistics'];
            $contentDetails = $video['contentDetails'];

            return [
                '_id' => $videoId,
                'title' => $snippet['title'],
                'description' => $snippet['description'],
                'thumbnail' => $snippet['thumbnails']['medium']['url'],
                'author' => $snippet['channelTitle'],
                'uploadDate' => $snippet['publishedAt'],
                'category' => 'YouTube',
                'views' => $statistics['viewCount'] ?? '0',
                'likes' => $statistics['likeCount'] ?? '0',
                'duration' => $contentDetails['duration'] ?? ''
            ];

        } catch (Exception $e) {
            error_log('Error fetching video by ID: ' . $e->getMessage());
            throw new Exception($e->getMessage() === ERROR_NOT_FOUND ? ERROR_NOT_FOUND : 'Failed to fetch video details');
        }
    }

    /**
     * Search videos by query
     */
    public function search($query, $maxResults = 20) {
        try {
            if (empty($this->youtubeApiKey) || empty($this->channelId)) {
                throw new Exception('YouTube API credentials not configured');
            }

            $url = 'https://www.googleapis.com/youtube/v3/search?' . http_build_query([
                'key' => $this->youtubeApiKey,
                'channelId' => $this->channelId,
                'part' => 'snippet',
                'order' => 'relevance',
                'maxResults' => $maxResults,
                'q' => $query,
                'type' => 'video'
            ]);

            $context = stream_context_create([
                'http' => [
                    'timeout' => 10,
                    'user_agent' => 'DeepMinds Research Lab API'
                ]
            ]);

            $response = file_get_contents($url, false, $context);

            if ($response === false) {
                throw new Exception('Failed to search YouTube videos');
            }

            $data = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON response from YouTube API');
            }

            if (isset($data['error'])) {
                throw new Exception('YouTube API error: ' . $data['error']['message']);
            }

            $videos = [];
            foreach ($data['items'] as $item) {
                $videos[] = [
                    '_id' => $item['id']['videoId'],
                    'title' => $item['snippet']['title'],
                    'description' => $item['snippet']['description'],
                    'thumbnail' => $item['snippet']['thumbnails']['medium']['url'],
                    'author' => $item['snippet']['channelTitle'],
                    'uploadDate' => $item['snippet']['publishedAt'],
                    'category' => 'YouTube'
                ];
            }

            return $videos;

        } catch (Exception $e) {
            error_log('Error searching YouTube videos: ' . $e->getMessage());
            throw new Exception('Failed to search videos: ' . $e->getMessage());
        }
    }

    /**
     * Get mock videos for testing when YouTube API is not configured
     */
    private function getMockVideos($maxResults = 12) {
        $mockVideos = [
            [
                '_id' => 'mock_video_1',
                'title' => 'Introduction to Machine Learning',
                'description' => 'A comprehensive introduction to machine learning concepts and applications.',
                'thumbnail' => 'https://via.placeholder.com/320x180/3b82f6/ffffff?text=ML+Intro',
                'author' => 'DeepMinds Research Lab',
                'uploadDate' => '2024-01-15T10:00:00Z',
                'category' => 'YouTube',
                'views' => '1250',
                'likes' => '45',
                'duration' => 'PT15M30S'
            ],
            [
                '_id' => 'mock_video_2',
                'title' => 'Deep Learning Fundamentals',
                'description' => 'Understanding neural networks and deep learning architectures.',
                'thumbnail' => 'https://via.placeholder.com/320x180/10b981/ffffff?text=Deep+Learning',
                'author' => 'DeepMinds Research Lab',
                'uploadDate' => '2024-01-10T14:30:00Z',
                'category' => 'YouTube',
                'views' => '2100',
                'likes' => '78',
                'duration' => 'PT22M15S'
            ],
            [
                '_id' => 'mock_video_3',
                'title' => 'Data Science Workshop',
                'description' => 'Hands-on workshop covering data analysis and visualization techniques.',
                'thumbnail' => 'https://via.placeholder.com/320x180/f59e0b/ffffff?text=Data+Science',
                'author' => 'DeepMinds Research Lab',
                'uploadDate' => '2024-01-05T09:15:00Z',
                'category' => 'YouTube',
                'views' => '890',
                'likes' => '32',
                'duration' => 'PT18M45S'
            ]
        ];

        return array_slice($mockVideos, 0, min($maxResults, count($mockVideos)));
    }
}
?>