// backend/routes/videos.js
const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// // Add new video
// router.post('/', async (req, res) => {
//   try {
//     const video = new Video(req.body);
//     await video.save();
//     res.status(201).json(video);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Get single video by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ message: 'Video not found' });
//     res.json(video);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
