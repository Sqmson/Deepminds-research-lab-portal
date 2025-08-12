const express = require('express');
const Publication = require('../models/Publication');
const { auth, facultyOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/publications
// @desc    Get all publications with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      publicationType,
      researchArea,
      year,
      author,
      search,
      page = 1,
      limit = 20,
      sortBy = 'year',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {
      isActive: true,
      status: 'published'
    };

    // Add filters
    if (publicationType && publicationType !== 'all') {
      query.publicationType = publicationType;
    }
    
    if (researchArea && researchArea !== 'all') {
      query.researchAreas = researchArea;
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (author) {
      query['authors.user'] = author;
    }

    let publications;
    let total;

    if (search) {
      // Text search
      publications = await Publication.searchPublications(search, {
        publicationType,
        researchArea,
        year: year ? parseInt(year) : undefined,
        limit: parseInt(limit),
        skip
      });
      
      // Get total count for search
      const searchQuery = {
        $text: { $search: search },
        isActive: true,
        status: 'published'
      };
      if (publicationType && publicationType !== 'all') searchQuery.publicationType = publicationType;
      if (researchArea && researchArea !== 'all') searchQuery.researchAreas = researchArea;
      if (year) searchQuery.year = parseInt(year);
      
      total = await Publication.countDocuments(searchQuery);
    } else {
      // Regular query
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      publications = await Publication.find(query)
        .populate('authors.user', 'firstName lastName position avatar')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
        
      total = await Publication.countDocuments(query);
    }

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: publications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPublications: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        publicationTypes: await Publication.distinct('publicationType', { isActive: true, status: 'published' }),
        researchAreas: await Publication.distinct('researchAreas', { isActive: true, status: 'published' }),
        years: await Publication.distinct('year', { isActive: true, status: 'published' }).sort({ year: -1 })
      }
    });

  } catch (error) {
    console.error('Error fetching publications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch publications',
      message: error.message
    });
  }
});

// @route   GET /api/publications/featured
// @desc    Get featured publications
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const publications = await Publication.getFeatured(parseInt(limit));

    res.json({
      success: true,
      data: publications
    });

  } catch (error) {
    console.error('Error fetching featured publications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured publications',
      message: error.message
    });
  }
});

// @route   GET /api/publications/recent
// @desc    Get recent publications
// @access  Public
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const publications = await Publication.getRecent(parseInt(limit));

    res.json({
      success: true,
      data: publications
    });

  } catch (error) {
    console.error('Error fetching recent publications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent publications',
      message: error.message
    });
  }
});

// @route   GET /api/publications/stats
// @desc    Get publication statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Publication.getStatistics();
    
    // Get publications by year
    const publicationsByYear = await Publication.aggregate([
      { $match: { isActive: true, status: 'published' } },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
          totalCitations: { $sum: '$citationCount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 10 }
    ]);

    // Get publications by type
    const publicationsByType = await Publication.aggregate([
      { $match: { isActive: true, status: 'published' } },
      {
        $group: {
          _id: '$publicationType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get top research areas
    const topResearchAreas = await Publication.aggregate([
      { $match: { isActive: true, status: 'published' } },
      { $unwind: '$researchAreas' },
      {
        $group: {
          _id: '$researchAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPublications: 0,
          totalCitations: 0,
          avgCitationsPerPaper: 0
        },
        publicationsByYear,
        publicationsByType,
        topResearchAreas
      }
    });

  } catch (error) {
    console.error('Error fetching publication stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch publication statistics',
      message: error.message
    });
  }
});

// @route   GET /api/publications/:id
// @desc    Get single publication
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id)
      .populate('authors.user', 'firstName lastName position avatar bio')
      .populate('relatedPublications', 'title authors year publicationType');

    if (!publication || !publication.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Publication not found'
      });
    }

    // Increment views
    await publication.incrementViews();

    res.json({
      success: true,
      data: publication
    });

  } catch (error) {
    console.error('Error fetching publication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch publication',
      message: error.message
    });
  }
});

// @route   GET /api/publications/author/:userId
// @desc    Get publications by author
// @access  Public
router.get('/author/:userId', async (req, res) => {
  try {
    const {
      publicationType,
      year,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const publications = await Publication.getByAuthor(req.params.userId, {
      publicationType,
      year: year ? parseInt(year) : undefined,
      limit: parseInt(limit),
      skip
    });

    const total = await Publication.countDocuments({
      'authors.user': req.params.userId,
      isActive: true,
      ...(publicationType && publicationType !== 'all' && { publicationType }),
      ...(year && { year: parseInt(year) })
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: publications,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPublications: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching author publications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch author publications',
      message: error.message
    });
  }
});

// @route   POST /api/publications
// @desc    Create new publication
// @access  Faculty only
router.post('/', auth, facultyOnly, async (req, res) => {
  try {
    const publicationData = {
      ...req.body,
      addedBy: req.user.userId
    };

    const publication = new Publication(publicationData);
    await publication.save();
    await publication.populate('authors.user', 'firstName lastName position avatar');

    res.status(201).json({
      success: true,
      message: 'Publication created successfully',
      data: publication
    });

  } catch (error) {
    console.error('Error creating publication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create publication',
      message: error.message
    });
  }
});

// @route   PUT /api/publications/:id
// @desc    Update publication
// @access  Faculty only (author or admin)
router.put('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'Publication not found'
      });
    }

    // Check if user is author or admin
    const isAuthor = publication.authors.some(
      author => author.user && author.user.toString() === req.user.userId
    );
    
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this publication'
      });
    }

    // Update publication
    Object.assign(publication, req.body);
    await publication.save();
    await publication.populate('authors.user', 'firstName lastName position avatar');

    res.json({
      success: true,
      message: 'Publication updated successfully',
      data: publication
    });

  } catch (error) {
    console.error('Error updating publication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update publication',
      message: error.message
    });
  }
});

// @route   DELETE /api/publications/:id
// @desc    Delete publication (soft delete)
// @access  Faculty only (author or admin)
router.delete('/:id', auth, facultyOnly, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'Publication not found'
      });
    }

    // Check if user is author or admin
    const isAuthor = publication.authors.some(
      author => author.user && author.user.toString() === req.user.userId
    );
    
    if (!isAuthor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this publication'
      });
    }

    publication.isActive = false;
    await publication.save();

    res.json({
      success: true,
      message: 'Publication deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting publication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete publication',
      message: error.message
    });
  }
});

// @route   POST /api/publications/:id/download
// @desc    Track publication download
// @access  Public
router.post('/:id/download', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        error: 'Publication not found'
      });
    }

    await publication.incrementDownloads();

    res.json({
      success: true,
      message: 'Download tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track download',
      message: error.message
    });
  }
});

module.exports = router;