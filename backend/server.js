require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // ✅ define app first
const PORT = process.env.PORT || 5000;
const helmet = require('helmet');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://deepminds-research-lab-portal-backend.onrender.com", "data:"],
      // add other directives as needed
    },
  })
);

// Middleware
const allowedOrigins = [
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
  }
}));
app.use(express.json());

// Routes
const articleRoutes = require('./routes/articles');
app.use('/articles', articleRoutes);
const videoRoutes = require('./routes/videos');
app.use('/videos', videoRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
