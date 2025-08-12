const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  abstract: {
    type: String,
    maxlength: 2000
  },
  
  // Authors
  authors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String, // For external authors not in system
    affiliation: String,
    isCorresponding: {
      type: Boolean,
      default: false
    },
    order: Number
  }],
  
  // Publication Details
  publicationType: {
    type: String,
    enum: ['journal', 'conference', 'workshop', 'book', 'chapter', 'thesis', 'preprint', 'patent', 'report'],
    required: true
  },
  
  // Journal/Conference Information
  venue: {
    name: String, // Journal name or Conference name
    abbreviation: String,
    volume: String,
    issue: String,
    pages: String,
    publisher: String,
    location: String, // For conferences
    issn: String,
    isbn: String
  },
  
  // Publication Dates
  publishedDate: Date,
  acceptedDate: Date,
  submittedDate: Date,
  year: {
    type: Number,
    required: true
  },
  
  // Identifiers and Links
  doi: String,
  pmid: String, // PubMed ID
  arxivId: String,
  url: String,
  pdfUrl: String,
  
  // Classification
  researchAreas: [{
    type: String,
    enum: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science', 'Artificial Intelligence', 'Software Engineering', 'Cybersecurity', 'Human-Computer Interaction', 'Distributed Systems']
  }],
  keywords: [String],
  tags: [String],
  
  // Academic Metrics
  citationCount: {
    type: Number,
    default: 0
  },
  hIndex: Number,
  impactFactor: Number,
  quartile: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['published', 'accepted', 'under_review', 'submitted', 'in_preparation', 'rejected'],
    default: 'published'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOpenAccess: {
    type: Boolean,
    default: false
  },
  
  // Additional Information
  funding: [{
    agency: String,
    grantNumber: String,
    amount: Number,
    currency: String
  }],
  
  // Files and Attachments
  attachments: [{
    type: {
      type: String,
      enum: ['pdf', 'supplementary', 'dataset', 'code', 'presentation', 'poster']
    },
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    description: String
  }],
  
  // Related Content
  relatedPublications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  relatedProjects: [String],
  
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  
  // Metadata
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // External IDs for syncing
  externalIds: {
    googleScholar: String,
    scopus: String,
    webOfScience: String,
    orcid: String
  }
}, {
  timestamps: true
});

// Indexes
publicationSchema.index({ year: -1 });
publicationSchema.index({ publicationType: 1 });
publicationSchema.index({ 'authors.user': 1 });
publicationSchema.index({ researchAreas: 1 });
publicationSchema.index({ status: 1, isActive: 1 });
publicationSchema.index({ isFeatured: -1, year: -1 });
publicationSchema.index({ doi: 1 });
publicationSchema.index({ citationCount: -1 });

// Text search index
publicationSchema.index({
  title: 'text',
  abstract: 'text',
  keywords: 'text',
  'venue.name': 'text'
});

// Virtual for formatted citation
publicationSchema.virtual('citation').get(function() {
  const authorNames = this.authors
    .sort((a, b) => a.order - b.order)
    .map(author => author.name || `${author.user?.firstName} ${author.user?.lastName}`)
    .join(', ');
  
  let citation = `${authorNames}. "${this.title}."`;
  
  if (this.venue.name) {
    citation += ` ${this.venue.name}`;
    if (this.venue.volume) citation += ` ${this.venue.volume}`;
    if (this.venue.issue) citation += `.${this.venue.issue}`;
    if (this.venue.pages) citation += ` (${this.venue.pages})`;
  }
  
  citation += ` (${this.year}).`;
  
  if (this.doi) {
    citation += ` DOI: ${this.doi}`;
  }
  
  return citation;
});

// Virtual for author count
publicationSchema.virtual('authorCount').get(function() {
  return this.authors.length;
});

// Virtual for corresponding author
publicationSchema.virtual('correspondingAuthor').get(function() {
  return this.authors.find(author => author.isCorresponding);
});

// Pre-save middleware
publicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Ensure authors are sorted by order
  this.authors.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  next();
});

// Methods
publicationSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

publicationSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

publicationSchema.methods.updateCitationCount = function(count) {
  this.citationCount = count;
  return this.save();
};

// Static methods
publicationSchema.statics.getByAuthor = function(userId, options = {}) {
  const {
    publicationType,
    year,
    limit = 20,
    skip = 0
  } = options;
  
  let query = {
    'authors.user': userId,
    isActive: true
  };
  
  if (publicationType && publicationType !== 'all') {
    query.publicationType = publicationType;
  }
  
  if (year) {
    query.year = year;
  }
  
  return this.find(query)
    .populate('authors.user', 'firstName lastName position')
    .sort({ year: -1, publishedDate: -1 })
    .skip(skip)
    .limit(limit);
};

publicationSchema.statics.getFeatured = function(limit = 5) {
  return this.find({
    isFeatured: true,
    isActive: true,
    status: 'published'
  })
  .populate('authors.user', 'firstName lastName position')
  .sort({ year: -1, citationCount: -1 })
  .limit(limit);
};

publicationSchema.statics.getRecent = function(limit = 10) {
  return this.find({
    isActive: true,
    status: 'published'
  })
  .populate('authors.user', 'firstName lastName position')
  .sort({ year: -1, publishedDate: -1 })
  .limit(limit);
};

publicationSchema.statics.getByResearchArea = function(area, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({
    researchAreas: area,
    isActive: true,
    status: 'published'
  })
  .populate('authors.user', 'firstName lastName position')
  .sort({ year: -1, citationCount: -1 })
  .skip(skip)
  .limit(limit);
};

publicationSchema.statics.searchPublications = function(searchTerm, options = {}) {
  const {
    publicationType,
    researchArea,
    year,
    limit = 20,
    skip = 0
  } = options;
  
  let query = {
    $text: { $search: searchTerm },
    isActive: true,
    status: 'published'
  };
  
  if (publicationType && publicationType !== 'all') {
    query.publicationType = publicationType;
  }
  
  if (researchArea && researchArea !== 'all') {
    query.researchAreas = researchArea;
  }
  
  if (year) {
    query.year = year;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('authors.user', 'firstName lastName position')
    .sort({ score: { $meta: 'textScore' }, year: -1 })
    .skip(skip)
    .limit(limit);
};

publicationSchema.statics.getStatistics = function() {
  return this.aggregate([
    { $match: { isActive: true, status: 'published' } },
    {
      $group: {
        _id: null,
        totalPublications: { $sum: 1 },
        totalCitations: { $sum: '$citationCount' },
        avgCitationsPerPaper: { $avg: '$citationCount' },
        publicationsByType: {
          $push: {
            type: '$publicationType',
            year: '$year'
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Publication', publicationSchema);