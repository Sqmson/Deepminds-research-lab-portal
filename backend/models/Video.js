// backend/models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  author: String,
  authorAvatar: String, // emoji or image URL
  category: String,
  duration: String,
  views: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  thumbnail: String, // could be emoji or image URL
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
