const express = require('express');
const Announcement = require('../models/Announcement');
const { auth, adminOnly, facultyOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all active announcements
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      category,
      targetAudience,
      page = 1,
      limit = 10,
      sortBy = 'publishDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine target audience based on user role
    let audience = 'all';
    if (req.user) {
      const roleMapping = {
        'admin': 'faculty',
        'professor': 'faculty',
        'student': 'students'
      };
      audience = roleMapping[req.user.role] || 'all';
    }

    const query = {
      isActive: true,
      isPublished: true,
      publishDate: { $lte: new Date() },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    };

    // Add filters
    if (type && type !== 'all') query.type = type;
    if (category && category !== 'all') query.category = category;
    if (targetAudience && targetAudience !== 'all') {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    } else {
      query.targetAudience = { $in: [audience, 'all'] };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Add pinned priority
    if (sortBy === 'publishDate') {
      sort.isPinned = -1;
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'firstName lastName position avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Announcement.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: announcements,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalAnnouncements: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch announcements',
      message: error.message
    });
  }
});

// @route   GET /api/announcements/recent
// @desc    Get recent announcements for dashboard
// @access  Public
router.get('/recent', optionalAuth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    let audience = 'all';
    if (req.user) {
      const roleMapping = {
        'admin': 'faculty',
        'professor': 'faculty',
        'student': 'students'
      };
      audience = roleMapping[req.user.role] || 'all';
    }

    const announcements = await Announcement.find({
      isActive: true,
      isPublished: true,
      publishDate: { $lte: new Date() },
      targetAudience: { $in: [audience, 'all'] },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    })
    .populate('author', 'firstName lastName position avatar')
    .sort({ isPinned: -1, publishDate: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: announcements
    });

  } catch (error) {
    console.error('Error fetching recent announcements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent announcements',
      message: error.message
    });
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName position avatar bio');

    if (!announcement || !announcement.isActive || !announcement.isPublished) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Increment views
    await announcement.incrementViews();

    // Mark as read if user is authenticated
    if (req.user) {
      await announcement.markAsRead(req.user.userId);
    }

    res.json({
      success: true,
      data: announcement
    });

  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch announcement',
      message: error.message
    });
  }
});

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Faculty only
router.post('/', auth, facultyOnly, async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      priority,
      targetAudience,
      category,
      tags,
      publishDate,
      expiryDate,
      isPinned
    } = req.body;

    const announcement = new Announcement({
      title,
      content,
      author: req.user.userId,
      type: type || 'general',
      priority: priority || 'medium',
      targetAudience: targetAudience || ['all'],
      category,
      tags: tags || [],
      publishDate: publishDate || new Date(),
      expiryDate,
      isPinned: isPinned || false,
      isPublished: true
    });

    await announcement.save();
    await announcement.populate('author', 'firstName lastName position avatar');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });

  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create announcement',
      message: error.message
    });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Faculty only (author or admin)
router.put('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Check if user is author or admin
    if (announcement.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this announcement'
      });
    }

    const {
      title,
      content,
      type,
      priority,
      targetAudience,
      category,
      tags,
      publishDate,
      expiryDate,
      isPinned,
      isPublished
    } = req.body;

    // Update fields
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (priority) announcement.priority = priority;
    if (targetAudience) announcement.targetAudience = targetAudience;
    if (category) announcement.category = category;
    if (tags) announcement.tags = tags;
    if (publishDate) announcement.publishDate = publishDate;
    if (expiryDate !== undefined) announcement.expiryDate = expiryDate;
    if (isPinned !== undefined) announcement.isPinned = isPinned;
    if (isPublished !== undefined) announcement.isPublished = isPublished;

    await announcement.save();
    await announcement.populate('author', 'firstName lastName position avatar');

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });

  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update announcement',
      message: error.message
    });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement (soft delete)
// @access  Faculty only (author or admin)
router.delete('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    // Check if user is author or admin
    if (announcement.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this announcement'
      });
    }

    announcement.isActive = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete announcement',
      message: error.message
    });
  }
});

// @route   POST /api/announcements/:id/like
// @desc    Like/unlike announcement
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
    }

    const existingLike = announcement.likes.find(
      like => like.user.toString() === req.user.userId
    );

    if (existingLike) {
      // Unlike
      await announcement.removeLike(req.user.userId);
      res.json({
        success: true,
        message: 'Announcement unliked',
        liked: false,
        likeCount: announcement.likeCount
      });
    } else {
      // Like
      await announcement.addLike(req.user.userId);
      res.json({
        success: true,
        message: 'Announcement liked',
        liked: true,
        likeCount: announcement.likeCount
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

module.exports = router;