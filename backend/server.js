require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://i.ytimg.com", "https://img.youtube.com", "data:", "blob:"],
      mediaSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "blob:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.youtube.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://www.googleapis.com"],
    },
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://deepminds-research-lab-portal.onrender.com',
  'https://deepminds-research-lab-portal-frontend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const videoRoutes = require('./routes/videos');
const announcementRoutes = require('./routes/announcements');
const publicationRoutes = require('./routes/publications');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/publications', publicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
