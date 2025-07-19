// backend/routes/articles.js
const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// GET all or filtered articles
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const articles = await Article.find(filter).sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST new article
router.post('/', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add article' });
  }
});

module.exports = router;
