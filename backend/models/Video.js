const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // YouTube specific fields
  youtubeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Basic video information
  title: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  
  // URL slug for SEO-friendly URLs
  slug: {
    type: String,
    unique: true,
    index: true
  },
  
  description: {
    type: String,
    default: '',
    index: 'text'
  },
  
  // Channel information
  channelId: {
    type: String,
    required: true,
    index: true
  },
  
  channelTitle: {
    type: String,
    required: true,
    index: true
  },
  
  // Media assets
  thumbnails: {
    default: { url: String, width: Number, height: Number },
    medium: { url: String, width: Number, height: Number },
    high: { url: String, width: Number, height: Number },
    standard: { url: String, width: Number, height: Number },
    maxres: { url: String, width: Number, height: Number }
  },
  
  // Video metadata
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  
  duration: {
    type: String, // ISO 8601 duration format (PT4M13S)
    default: null
  },
  
  // Statistics
  viewCount: {
    type: Number,
    default: 0
  },
  
  likeCount: {
    type: Number,
    default: 0
  },
  
  commentCount: {
    type: Number,
    default: 0
  },
  
  // Content classification
  category: {
    type: String,
    enum: ['Research', 'Tutorial', 'Discussion', 'Lab Work', 'Seminar', 'Workshop', 'Other'],
    default: 'Discussion'
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Custom fields for research lab
  researchArea: {
    type: String,
    enum: ['AI/ML', 'Computer Vision', 'NLP', 'Robotics', 'Data Science', 'Other'],
    default: 'Other'
  },
  
  speakers: [{
    name: String,
    role: String,
    affiliation: String
  }],
  
  // Engagement tracking
  localViews: {
    type: Number,
    default: 0
  },
  
  lastSynced: {
    type: Date,
    default: Date.now
  },
  
  // Search optimization
  searchKeywords: [{
    type: String,
    lowercase: true
  }],
  
  // Status and visibility
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  analytics: {
    totalWatchTime: { type: Number, default: 0 },
    averageWatchTime: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ publishedAt: -1 });
videoSchema.index({ category: 1, publishedAt: -1 });
videoSchema.index({ researchArea: 1, publishedAt: -1 });
videoSchema.index({ isActive: 1, isFeatured: -1, publishedAt: -1 });
videoSchema.index({ slug: 1 });

// Virtual for formatted duration
videoSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return 'N/A';
  
  const match = this.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'N/A';
  
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for YouTube embed URL
videoSchema.virtual('embedUrl').get(function() {
  return `https://www.youtube.com/embed/${this.youtubeId}`;
});

// Virtual for YouTube watch URL
videoSchema.virtual('watchUrl').get(function() {
  return `https://www.youtube.com/watch?v=${this.youtubeId}`;
});

// Virtual for best thumbnail
videoSchema.virtual('bestThumbnail').get(function() {
  return this.thumbnails?.maxres?.url || 
         this.thumbnails?.high?.url || 
         this.thumbnails?.standard?.url || 
         this.thumbnails?.medium?.url || 
         this.thumbnails?.default?.url || 
         null;
});

// Methods
videoSchema.methods.incrementLocalViews = function() {
  this.localViews += 1;
  return this.save();
};

videoSchema.methods.updateAnalytics = function(watchTime, clickThrough = false) {
  if (watchTime) {
    this.analytics.totalWatchTime += watchTime;
    this.analytics.averageWatchTime = this.analytics.totalWatchTime / (this.localViews || 1);
  }
  
  if (clickThrough) {
    this.analytics.clickThroughRate = (this.analytics.clickThroughRate * this.localViews + 1) / (this.localViews + 1);
  }
  
  // Calculate engagement rate based on likes, comments, and views
  const totalEngagement = (this.likeCount || 0) + (this.commentCount || 0);
  const totalViews = (this.viewCount || 0) + this.localViews;
  this.analytics.engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
  
  return this.save();
};

// Static methods
videoSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

videoSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

videoSchema.statics.searchVideos = function(query, options = {}) {
  const {
    category,
    researchArea,
    limit = 20,
    skip = 0,
    sortBy = 'publishedAt',
    sortOrder = -1
  } = options;
  
  let searchQuery = { isActive: true };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category && category !== 'All') {
    searchQuery.category = category;
  }
  
  if (researchArea && researchArea !== 'All') {
    searchQuery.researchArea = researchArea;
  }
  
  const sort = {};
  sort[sortBy] = sortOrder;
  
  return this.find(searchQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Helper function to generate URL slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Pre-save middleware
videoSchema.pre('save', async function(next) {
  // Generate URL slug from title
  if (this.isModified('title') || !this.slug) {
    let baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug uniqueness
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // Generate search keywords from title and description
  if (this.isModified('title') || this.isModified('description')) {
    const keywords = new Set();
    
    // Extract keywords from title
    const titleWords = this.title.toLowerCase().match(/\b\w+\b/g) || [];
    titleWords.forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Extract keywords from description
    const descWords = this.description.toLowerCase().match(/\b\w+\b/g) || [];
    descWords.slice(0, 20).forEach(word => { // Limit description keywords
      if (word.length > 3) keywords.add(word);
    });
    
    this.searchKeywords = Array.from(keywords);
  }
  
  next();
});

module.exports = mongoose.model('Video', videoSchema);