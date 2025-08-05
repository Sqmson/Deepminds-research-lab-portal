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
        maxResults: 20,
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
        uploadDate: item.snippet.publishedAt,
        category: 'YouTube',
        views: 'N/A',
        duration: 'N/A',
      }));

    res.json(videos);
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /videos/:id
const Video = require('../models/Video');
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing video id' });
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching video' });
  }
});

module.exports = router;
