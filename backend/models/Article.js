const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Publication Details
  publishedDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  
  // Classification
  category: {
    type: String,
    enum: ['Research', 'Tutorial', 'News', 'Opinion', 'Review', 'Case Study', 'Technical', 'Academic'],
    required: true
  },
  researchArea: {
    type: String,
    enum: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science', 'Artificial Intelligence', 'Software Engineering', 'Cybersecurity', 'Human-Computer Interaction', 'Distributed Systems']
  },
  
  // Content Organization
  tags: [{
    type: String,
    trim: true
  }],
  keywords: [String],
  
  // Media and Attachments
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  
  // SEO and Metadata
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  metaDescription: String,
  metaKeywords: [String],
  
  // Academic Information
  doi: String,
  citationCount: {
    type: Number,
    default: 0
  },
  references: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  
  // Reading Time Estimation
  readingTime: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
articleSchema.index({ publishedDate: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ slug: 1 });
articleSchema.index({ isFeatured: -1, publishedDate: -1 });
articleSchema.index({ researchArea: 1 });
articleSchema.index({ status: 1, isActive: 1 });

// Text search index
articleSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text',
  keywords: 'text'
});

// Virtual for like count
articleSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
articleSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for formatted date
articleSchema.virtual('formattedDate').get(function() {
  return this.publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware
articleSchema.pre('save', function(next) {
  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 497) + (plainText.length > 497 ? '...' : '');
  }
  
  // Generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Estimate reading time (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  // Update lastModified
  this.lastModified = new Date();
  
  next();
});

// Methods
articleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

articleSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

articleSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

articleSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content,
    isApproved: false // Requires admin approval
  });
  return this.save();
};

// Static methods
articleSchema.statics.getPublished = function(options = {}) {
  const {
    category,
    researchArea,
    tags,
    limit = 20,
    skip = 0,
    sortBy = 'publishedDate',
    sortOrder = -1
  } = options;
  
  let query = {
    status: 'published',
    isActive: true
  };
  
  if (category && category !== 'All') query.category = category;
  if (researchArea && researchArea !== 'All') query.researchArea = researchArea;
  if (tags && tags.length > 0) query.tags = { $in: tags };
  
  const sort = {};
  sort[sortBy] = sortOrder;
  
  return this.find(query)
    .populate('author', 'firstName lastName position avatar')
    .populate('coAuthors', 'firstName lastName position')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

articleSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    status: 'published',
    isActive: true,
    isFeatured: true
  })
  .populate('author', 'firstName lastName position avatar')
  .sort({ publishedDate: -1 })
  .limit(limit);
};

articleSchema.statics.searchArticles = function(searchTerm, options = {}) {
  const {
    category,
    researchArea,
    limit = 20,
    skip = 0
  } = options;
  
  let query = {
    $text: { $search: searchTerm },
    status: 'published',
    isActive: true
  };
  
  if (category && category !== 'All') query.category = category;
  if (researchArea && researchArea !== 'All') query.researchArea = researchArea;
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('author', 'firstName lastName position avatar')
    .sort({ score: { $meta: 'textScore' }, publishedDate: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Article', articleSchema);
