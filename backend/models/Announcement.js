const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Classification
  type: {
    type: String,
    enum: ['general', 'academic', 'event', 'deadline', 'achievement', 'research', 'seminar'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Targeting
  targetAudience: [{
    type: String,
    enum: ['all', 'faculty', 'students', 'phd_students', 'masters_students', 'undergraduate_students', 'research_assistants']
  }],
  
  // Visibility and Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  
  // Scheduling
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  
  // Engagement
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
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
  
  // Tags and Categories
  tags: [String],
  category: {
    type: String,
    enum: ['Academic', 'Research', 'Events', 'Deadlines', 'Achievements', 'General', 'Seminars', 'Workshops']
  },
  
  // Metadata
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ type: 1, isActive: 1 });
announcementSchema.index({ isPinned: -1, publishDate: -1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ expiryDate: 1 });
announcementSchema.index({ tags: 1 });

// Virtual for like count
announcementSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Virtual for time since published
announcementSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.publishDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

// Pre-save middleware to generate excerpt
announcementSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 297) + (this.content.length > 297 ? '...' : '');
  }
  next();
});

// Method to increment views
announcementSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add like
announcementSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
announcementSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Method to mark as read
announcementSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get active announcements
announcementSchema.statics.getActive = function(targetAudience = 'all') {
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
  
  if (targetAudience !== 'all') {
    query.targetAudience = { $in: [targetAudience, 'all'] };
  }
  
  return this.find(query)
    .populate('author', 'firstName lastName position avatar')
    .sort({ isPinned: -1, publishDate: -1 });
};

// Static method to get recent announcements
announcementSchema.statics.getRecent = function(limit = 5) {
  return this.find({
    isActive: true,
    isPublished: true,
    publishDate: { $lte: new Date() }
  })
  .populate('author', 'firstName lastName position avatar')
  .sort({ publishDate: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Announcement', announcementSchema);