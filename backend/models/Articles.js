// backend/models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  author: String,
  date: Date,
  category: String,
  readTime: String,
  views: String,
  tags: [String]
});

module.exports = mongoose.model('Article', articleSchema);
