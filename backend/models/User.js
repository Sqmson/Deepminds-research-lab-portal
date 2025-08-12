const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
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
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  position: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'PhD Student', 'Masters Student', 'Undergraduate Student', 'Research Assistant', 'Visiting Scholar'],
    required: true
  },
  
  // Academic Information
  department: {
    type: String,
    default: 'Faculty of Computing and Informatics'
  },
  researchAreas: [{
    type: String,
    enum: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Data Science', 'Artificial Intelligence', 'Software Engineering', 'Cybersecurity', 'Human-Computer Interaction', 'Distributed Systems']
  }],
  
  // Contact Information
  officeLocation: String,
  phoneNumber: String,
  website: String,
  linkedIn: String,
  googleScholar: String,
  orcid: String,
  
  // System Information
  role: {
    type: String,
    enum: ['admin', 'professor', 'student', 'visitor'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  
  // Academic Year and Program
  academicYear: String,
  program: String,
  studentId: String,
  
  // Publications and Research
  publications: [{
    title: String,
    authors: [String],
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    researchUpdates: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ researchAreas: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
userSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.preferences;
  delete userObject.isEmailVerified;
  return userObject;
};

// Static method to find by research area
userSchema.statics.findByResearchArea = function(area) {
  return this.find({ 
    researchAreas: area, 
    isActive: true 
  }).select('-password');
};

// Static method to get faculty members
userSchema.statics.getFacultyMembers = function() {
  return this.find({ 
    role: { $in: ['admin', 'professor'] }, 
    isActive: true 
  }).select('-password').sort({ position: 1, lastName: 1 });
};

// Static method to get students
userSchema.statics.getStudents = function() {
  return this.find({ 
    role: 'student', 
    isActive: true 
  }).select('-password').sort({ academicYear: -1, lastName: 1 });
};

module.exports = mongoose.model('User', userSchema);