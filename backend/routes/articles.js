const express = require('express');
const Article = require('../models/Article');
const { auth, facultyOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all published articles with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      researchArea,
      tags,
      search,
      page = 1,
      limit = 10,
      sortBy = 'publishedDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let articles;
    let total;

    if (search) {
      // Text search
      articles = await Article.searchArticles(search, {
        category,
        researchArea,
        limit: parseInt(limit),
        skip
      });
      
      // Get total count for search
      const searchQuery = {
        $text: { $search: search },
        status: 'published',
        isActive: true
      };
      if (category && category !== 'All') searchQuery.category = category;
      if (researchArea && researchArea !== 'All') searchQuery.researchArea = researchArea;
      
      total = await Article.countDocuments(searchQuery);
    } else {
      // Regular query with filters
      articles = await Article.getPublished({
        category,
        researchArea,
        tags: tags ? tags.split(',') : undefined,
        limit: parseInt(limit),
        skip,
        sortBy,
        sortOrder: sortOrder === 'desc' ? -1 : 1
      });
      
      // Get total count
      let countQuery = {
        status: 'published',
        isActive: true
      };
      if (category && category !== 'All') countQuery.category = category;
      if (researchArea && researchArea !== 'All') countQuery.researchArea = researchArea;
      if (tags) countQuery.tags = { $in: tags.split(',') };
      
      total = await Article.countDocuments(countQuery);
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalArticles: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        categories: await Article.distinct('category', { status: 'published', isActive: true }),
        researchAreas: await Article.distinct('researchArea', { status: 'published', isActive: true }),
        tags: await Article.distinct('tags', { status: 'published', isActive: true })
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
      message: error.message
    });
  }
});

// @route   GET /api/articles/featured
// @desc    Get featured articles
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const articles = await Article.getFeatured(parseInt(limit));

    res.json({
      success: true,
      data: articles
    });

  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured articles',
      message: error.message
    });
  }
});

// @route   GET /api/articles/:id
// @desc    Get single article by ID or slug
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let article;
    
    // Try to find by ID first, then by slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(req.params.id);
    } else {
      article = await Article.findOne({ slug: req.params.id });
    }
    
    if (!article || article.status !== 'published' || !article.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Populate author and co-authors
    await article.populate('author', 'firstName lastName position avatar bio');
    await article.populate('coAuthors', 'firstName lastName position avatar');

    // Increment views
    await article.incrementViews();

    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { researchArea: article.researchArea },
        { tags: { $in: article.tags } }
      ],
      status: 'published',
      isActive: true
    })
    .populate('author', 'firstName lastName position avatar')
    .sort({ publishedDate: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
      message: error.message
    });
  }
});

// @route   POST /api/articles
// @desc    Create new article
// @access  Faculty only
router.post('/', auth, facultyOnly, async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user.userId,
      status: 'published' // Auto-publish for faculty
    };

    const article = new Article(articleData);
    await article.save();
    await article.populate('author', 'firstName lastName position avatar');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });

  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create article',
      message: error.message
    });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Faculty only (author or admin)
router.put('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Check if user is author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this article'
      });
    }

    // Update article
    Object.assign(article, req.body);
    await article.save();
    await article.populate('author', 'firstName lastName position avatar');

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });

  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update article',
      message: error.message
    });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete article (soft delete)
// @access  Faculty only (author or admin)
router.delete('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Check if user is author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this article'
      });
    }

    article.isActive = false;
    await article.save();

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete article',
      message: error.message
    });
  }
});

// @route   POST /api/articles/:id/like
// @desc    Like/unlike article
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    const existingLike = article.likes.find(
      like => like.user.toString() === req.user.userId
    );

    if (existingLike) {
      // Unlike
      await article.removeLike(req.user.userId);
      res.json({
        success: true,
        message: 'Article unliked',
        liked: false,
        likeCount: article.likeCount
      });
    } else {
      // Like
      await article.addLike(req.user.userId);
      res.json({
        success: true,
        message: 'Article liked',
        liked: true,
        likeCount: article.likeCount
      });
    }

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle like',
      message: error.message
    });
  }
});

// @route   POST /api/articles/:id/comment
// @desc    Add comment to article
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    await article.addComment(req.user.userId, content.trim());

    res.status(201).json({
      success: true,
      message: 'Comment added successfully (pending approval)'
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment',
      message: error.message
    });
  }
});

module.exports = router;
