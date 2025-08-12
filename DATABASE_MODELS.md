# Database Models for Deepminds Research Lab Portal

## User Model

```javascript
// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['lab_director', 'research_member', 'visitor'],
    default: 'visitor'
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  researchInterests: [{
    type: String,
    trim: true
  }],
  publications: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    orcid: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
```

## Forum Model

```javascript
// backend/models/Forum.js
const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'research', 'announcements', 'events', 'resources'],
    default: 'general'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isModerated: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  threadCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);
```

## Thread Model

```javascript
// backend/models/Thread.js
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  forumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastPost: {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number
  }]
}, {
  timestamps: true
});

// Index for search functionality
threadSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Thread', threadSchema);
```

## Post Model

```javascript
// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: Date,
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Index for search functionality
postSchema.index({ content: 'text' });

module.exports = mongoose.model('Post', postSchema);
```

## Event Model

```javascript
// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['seminar', 'workshop', 'conference', 'meeting', 'social'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  meetingLink: {
    type: String,
    default: null
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [{
    name: String,
    bio: String,
    affiliation: String,
    profileImage: String
  }],
  registeredUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

// Index for search and filtering
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
```

## Project Model

```javascript
// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on_hold', 'cancelled'],
    default: 'planning'
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['lead', 'researcher', 'contributor'],
      default: 'contributor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    url: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  fundingSource: {
    type: String,
    default: null
  },
  fundingAmount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  publications: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    default: null
  },
  websiteUrl: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
```

## Resource Model

```javascript
// backend/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['tutorial', 'paper', 'dataset', 'code', 'presentation', 'video', 'other'],
    required: true
  },
  url: {
    type: String,
    default: null
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['machine_learning', 'deep_learning', 'data_science', 'programming', 'research_methods', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for search functionality
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
```

## Notification Model

```javascript
// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['forum_reply', 'forum_mention', 'event_reminder', 'event_update', 'project_update', 'system_announcement'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  relatedModel: {
    type: String,
    enum: ['Thread', 'Post', 'Event', 'Project', 'Resource'],
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  actionUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
```

## Updated Article Model

```javascript
// backend/models/Article.js (Enhanced version)
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['research', 'news', 'announcement', 'tutorial', 'publication'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    default: null
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  seoTitle: {
    type: String,
    default: null
  },
  seoDescription: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for search functionality
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);
```

## Database Indexes

```javascript
// Database indexes for optimal performance
// Run these in MongoDB shell or through migration scripts

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

// Forum indexes
db.forums.createIndex({ "category": 1, "isActive": 1 });
db.forums.createIndex({ "lastActivity": -1 });

// Thread indexes
db.threads.createIndex({ "forumId": 1, "isPinned": -1, "lastPost.createdAt": -1 });
db.threads.createIndex({ "authorId": 1 });
db.threads.createIndex({ "tags": 1 });

// Post indexes
db.posts.createIndex({ "threadId": 1, "createdAt": 1 });
db.posts.createIndex({ "authorId": 1 });
db.posts.createIndex({ "parentPostId": 1 });

// Event indexes
db.events.createIndex({ "startDate": 1, "endDate": 1 });
db.events.createIndex({ "type": 1, "status": 1 });
db.events.createIndex({ "organizerId": 1 });
db.events.createIndex({ "isPublic": 1 });

// Project indexes
db.projects.createIndex({ "status": 1 });
db.projects.createIndex({ "collaborators.userId": 1 });
db.projects.createIndex({ "startDate": -1 });

// Resource indexes
db.resources.createIndex({ "type": 1, "category": 1 });
db.resources.createIndex({ "uploadedBy": 1 });
db.resources.createIndex({ "isPublic": 1 });

// Notification indexes
db.notifications.createIndex({ "userId": 1, "isRead": 1, "createdAt": -1 });
db.notifications.createIndex({ "type": 1 });

// Article indexes
db.articles.createIndex({ "author": 1 });
db.articles.createIndex({ "category": 1, "isPublished": 1 });
db.articles.createIndex({ "publishedAt": -1 });
```

## Model Relationships Summary

1. **User** → Central entity referenced by all other models
2. **Forum** → Contains multiple **Threads**
3. **Thread** → Contains multiple **Posts** and belongs to a **Forum**
4. **Post** → Belongs to a **Thread** and can have parent **Post** (for replies)
5. **Event** → Has registered **Users** and is organized by a **User**
6. **Project** → Has multiple **User** collaborators
7. **Resource** → Uploaded by a **User**
8. **Notification** → Belongs to a **User**
9. **Article** → Written by a **User**

This comprehensive database schema supports all the features outlined in the architecture plan and provides the foundation for building a robust research lab portal.