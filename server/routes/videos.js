const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;


// GET /videos
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet',
        order: 'date',
        maxResults
      },
    });

    const videos = response.data.items
      .filter(item => item.id.kind === 'youtube#video')
      .map(item => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        author: item.snippet.channelTitle,
        uploadDate: item.snippet.publishedAt
      }));

    res.json(videos);
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: YOUTUBE_API_KEY,
        id,
        part: 'snippet,contentDetails,statistics',
      },
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = response.data.items[0];
    const formattedVideo = {
      _id: id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      author: video.snippet.channelTitle,
      uploadDate: video.snippet.publishedAt,
      category: 'YouTube',
      views: video.statistics.viewCount,
      likes: video.statistics.likeCount,
      duration: video.contentDetails.duration,
    };

    res.json(formattedVideo);
  } catch (error) {
    console.error('Failed to fetch video by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});


module.exports = router;
