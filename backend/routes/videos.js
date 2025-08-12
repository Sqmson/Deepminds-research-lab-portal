const express = require('express');
const Video = require('../models/Video');
const youtubeService = require('../services/youtubeService');

const router = express.Router();

// Middleware for request validation
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50); // Max 50 per page
  const skip = (page - 1) * limit;
  
  req.pagination = { page, limit, skip };
  next();
};

// Auto-sync videos from YouTube (called internally)
async function autoSyncVideos() {
  try {
    console.log('🔄 Auto-syncing videos from YouTube...');
    
    // Check if we need to sync (only sync if no videos or last sync was > 1 hour ago)
    const videoCount = await Video.countDocuments({ isActive: true });
    const lastVideo = await Video.findOne({ isActive: true }).sort({ lastSynced: -1 });
    
    const shouldSync = videoCount === 0 || 
      !lastVideo || 
      (Date.now() - lastVideo.lastSynced.getTime()) > (60 * 60 * 1000); // 1 hour
    
    if (!shouldSync) {
      console.log('✅ Videos are up to date, skipping sync');
      return;
    }
    
    // Validate YouTube credentials
    const isValid = await youtubeService.validateCredentials();
    if (!isValid) {
      console.warn('⚠️ YouTube API credentials invalid, skipping sync');
      return;
    }
    
    const syncedVideos = await youtubeService.syncChannelVideos(50);
    console.log(`✅ Auto-synced ${syncedVideos.length} videos`);
    
  } catch (error) {
    console.error('❌ Auto-sync failed:', error.message);
  }
}

// GET /api/videos - Get all videos with search, filtering, and pagination
router.get('/', validatePagination, async (req, res) => {
  try {
    // Auto-sync videos before serving
    await autoSyncVideos();
    
    const {
      search,
      category,
      researchArea,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      featured
    } = req.query;
    
    const { limit, skip } = req.pagination;
    
    // Build search options
    const searchOptions = {
      category,
      researchArea,
      limit,
      skip,
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };
    
    let videos;
    let total;
    
    if (featured === 'true') {
      // Get featured videos
      videos = await Video.findFeatured(limit);
      total = await Video.countDocuments({ isFeatured: true, isActive: true });
    } else if (search) {
      // Search videos
      videos = await Video.searchVideos(search, searchOptions);
      
      // Get total count for pagination
      let countQuery = { isActive: true };
      if (search) countQuery.$text = { $search: search };
      if (category && category !== 'All') countQuery.category = category;
      if (researchArea && researchArea !== 'All') countQuery.researchArea = researchArea;
      
      total = await Video.countDocuments(countQuery);
    } else {
      // Get all videos with filters
      let query = { isActive: true };
      if (category && category !== 'All') query.category = category;
      if (researchArea && researchArea !== 'All') query.researchArea = researchArea;
      
      const sort = {};
      sort[sortBy] = searchOptions.sortOrder;
      
      videos = await Video.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
        
      total = await Video.countDocuments(query);
    }
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = req.pagination.page < totalPages;
    const hasPrevPage = req.pagination.page > 1;
    
    res.json({
      success: true,
      data: videos,
      pagination: {
        currentPage: req.pagination.page,
        totalPages,
        totalVideos: total,
        hasNextPage,
        hasPrevPage,
        limit
      },
      filters: {
        categories: await Video.distinct('category', { isActive: true }),
        researchAreas: await Video.distinct('researchArea', { isActive: true })
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching videos:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch videos',
      message: error.message
    });
  }
});

// GET /api/videos/stats - Get video statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Video.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          totalLocalViews: { $sum: '$localViews' },
          avgDuration: { $avg: '$analytics.averageWatchTime' },
          categories: { $addToSet: '$category' },
          researchAreas: { $addToSet: '$researchArea' }
        }
      }
    ]);
    
    const categoryStats = await Video.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const recentVideos = await Video.find({ isActive: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title publishedAt viewCount category slug');
    
    // Get channel stats if available
    let channelStats = null;
    try {
      channelStats = await youtubeService.getChannelStats();
    } catch (error) {
      console.warn('⚠️ Could not fetch channel stats:', error.message);
    }
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalVideos: 0,
          totalViews: 0,
          totalLocalViews: 0,
          avgDuration: 0,
          categories: [],
          researchAreas: []
        },
        categoryBreakdown: categoryStats,
        recentVideos,
        channelStats
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching video stats:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video statistics',
      message: error.message
    });
  }
});

// GET /api/videos/:slug - Get single video by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    console.log(`🎥 Fetching video with slug: ${slug}`);
    
    // Find video by slug (database-first approach)
    const video = await Video.findOne({ 
      slug: slug, 
      isActive: true 
    });
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
        message: 'Video not found in database'
      });
    }
    
    // Increment local view count
    try {
      await video.incrementLocalViews();
    } catch (incrementError) {
      console.warn(`⚠️ Failed to increment views for video ${slug}:`, incrementError.message);
    }
    
    // Get related videos
    let relatedVideos = [];
    try {
      relatedVideos = await Video.find({
        _id: { $ne: video._id },
        $or: [
          { category: video.category },
          { researchArea: video.researchArea },
          { tags: { $in: video.tags || [] } }
        ],
        isActive: true
      })
      .sort({ publishedAt: -1 })
      .limit(6)
      .select('youtubeId title thumbnails publishedAt viewCount category slug');
    } catch (relatedError) {
      console.warn(`⚠️ Failed to fetch related videos for ${slug}:`, relatedError.message);
      relatedVideos = [];
    }
    
    res.json({
      success: true,
      data: {
        video,
        relatedVideos
      }
    });
    
  } catch (error) {
    console.error(`❌ Error fetching video ${req.params.slug}:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video',
      message: error.message
    });
  }
});

// PUT /api/videos/:slug - Update video (admin endpoint)
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updates.youtubeId;
    delete updates.viewCount;
    delete updates.likeCount;
    delete updates.commentCount;
    delete updates.lastSynced;
    delete updates.slug; // Slug is auto-generated from title
    
    const video = await Video.findOneAndUpdate(
      { slug: slug },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      data: video,
      message: 'Video updated successfully'
    });
    
  } catch (error) {
    console.error(`❌ Error updating video ${req.params.slug}:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update video',
      message: error.message
    });
  }
});

// POST /api/videos/:slug/analytics - Track video analytics
router.post('/:slug/analytics', async (req, res) => {
  try {
    const { slug } = req.params;
    const { watchTime, clickThrough } = req.body;
    
    const video = await Video.findOne({ 
      slug: slug, 
      isActive: true 
    });
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    await video.updateAnalytics(watchTime, clickThrough);
    
    res.json({
      success: true,
      message: 'Analytics updated successfully'
    });
    
  } catch (error) {
    console.error(`❌ Error updating analytics for video ${req.params.slug}:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update analytics',
      message: error.message
    });
  }
});

// DELETE /api/videos/:slug - Soft delete video (admin endpoint)
router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const video = await Video.findOneAndUpdate(
      { slug: slug },
      { isActive: false },
      { new: true }
    );
    
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
    
  } catch (error) {
    console.error(`❌ Error deleting video ${req.params.slug}:`, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete video',
      message: error.message
    });
  }
});

module.exports = router;
