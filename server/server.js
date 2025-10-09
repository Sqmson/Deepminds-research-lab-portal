require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8500;

// Security
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://deepminds-research-lab-portal-backend.onrender.com", "data:"],
    },
  })
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const articleRoutes = require('./routes/articles');
app.use('/articles', articleRoutes);
const videoRoutes = require('./routes/videos');
app.use('/videos', videoRoutes);
const adminRoutes = require('./routes/admin');
// Mount admin API at /admin so the admin UI is available at https://<host>/admin
app.use('/admin', adminRoutes);
const announcementsRoutes = require('./routes/announcements');
app.use('/announcements', announcementsRoutes);

// Connect to Mongo and start server
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || undefined })
  .then(() => {
    console.log('✅ MongoDB connected');
    // use native http server so socket.io can attach
    const http = require('http');
    const server = http.createServer(app);
    const { setupSocket } = require('./socket');
    setupSocket(server);
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // exit with failure code so orchestrators can detect
    process.exit(1);
  });
