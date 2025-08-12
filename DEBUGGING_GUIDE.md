# Debugging Guide - CORS and Authentication Issues

## Current Issues Analysis

Based on your existing [`backend/server.js`](backend/server.js:1) file, I've identified several issues that could be causing CORS and authentication problems:

### 1. Server Configuration Issues

#### Problem: Duplicate Port Definitions
```javascript
// Lines 7 and 37 in server.js
const PORT = process.env.PORT || 5000;
const PORT0 = process.env.PORT || 5000;
```

#### Problem: Duplicate Server Startup
```javascript
// Lines 39-41 and 48 in server.js
app.listen(PORT0, () => {
  console.log(`🚀 Server running on port ${PORT0}`);
});

// Later...
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

### 2. CORS Configuration Issues

#### Current CORS Setup
```javascript
// Lines 21-26 in server.js
const allowedOrigins = [
  'https://deepminds-research-lab-portal.onrender.com',
  'https://deepminds-research-lab-portal-frontend.onrender.com'
];

app.use(cors()); // Not using the allowedOrigins!
```

## Solutions

### 1. Fix Server Configuration

Create a new corrected [`backend/server.js`](backend/server.js:1):

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'https://deepminds-research-lab-portal.vercel.app',
    'https://deepminds-research-lab-portal.onrender.com',
    'https://deepminds-research-lab-portal-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-Total-Count']
};

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'", 
        "https://res.cloudinary.com",
        "https://deepminds-research-lab-portal-backend.onrender.com", 
        "data:"
      ],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"]
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Apply CORS
app.use(cors(corsOptions));

// Body parsing middleware
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

// API Routes
const articleRoutes = require('./routes/articles');
const videoRoutes = require('./routes/videos');

app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// MongoDB Connection and Server Startup
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = app;
```

### 2. Fix Frontend API Configuration

Create [`frontend/src/utils/api.js`](frontend/src/utils/api.js:1):

```javascript
import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://deepminds-research-lab-portal-backend.onrender.com/api'
  );

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3. Environment Variables Setup

#### Backend `.env` file:
```env
# Database
MONGO_URI=mongodb+srv://your-connection-string

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# YouTube API (if needed)
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id

# Server
NODE_ENV=production
PORT=5000

# Frontend URL
FRONTEND_URL=https://deepminds-research-lab-portal.vercel.app
```

#### Frontend `.env` file:
```env
# API Configuration
VITE_API_URL=https://deepminds-research-lab-portal-backend.onrender.com/api

# App Configuration
VITE_APP_NAME=Deepminds Research Lab Portal
VITE_APP_VERSION=1.0.0
```

### 4. Fix Video Route Issue

The [`backend/routes/videos.js`](backend/routes/videos.js:20) has a missing variable:

```javascript
// Line 20 - missing maxResults variable
maxResults: 50 // Add this line
```

### 5. Add Authentication Middleware

Create [`backend/middleware/auth.js`](backend/middleware/auth.js:1):

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token or user not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

// Check user roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
```

### 6. Testing the Fixes

#### Test CORS Configuration:
```javascript
// Test script to run in browser console
fetch('http://localhost:5000/health', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log('CORS test successful:', data))
.catch(error => console.error('CORS test failed:', error));
```

#### Test API Endpoints:
```bash
# Test health endpoint
curl -X GET http://localhost:5000/health

# Test CORS preflight
curl -X OPTIONS http://localhost:5000/api/articles \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization"
```

### 7. Common CORS Issues and Solutions

#### Issue: "Access to fetch at '...' has been blocked by CORS policy"
**Solution:** Ensure your frontend URL is in the `corsOptions.origin` array.

#### Issue: "Request header field authorization is not allowed"
**Solution:** Add 'Authorization' to `corsOptions.allowedHeaders`.

#### Issue: "Credentials include but Access-Control-Allow-Credentials is false"
**Solution:** Set `credentials: true` in CORS options.

#### Issue: "Cannot read property of undefined" in API calls
**Solution:** Check that `VITE_API_URL` environment variable is set correctly.

### 8. Deployment Checklist

#### Render Backend Deployment:
1. Set environment variables in Render dashboard
2. Ensure `NODE_ENV=production`
3. Add frontend URLs to CORS origins
4. Test health endpoint: `https://your-backend.onrender.com/health`

#### Vercel Frontend Deployment:
1. Set `VITE_API_URL` environment variable
2. Test API connectivity from deployed frontend
3. Check browser network tab for CORS errors

### 9. Monitoring and Debugging

#### Add Request Logging:
```javascript
// Add to server.js before routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.get('Origin'));
  console.log('Headers:', req.headers);
  next();
});
```

#### Frontend Error Handling:
```javascript
// Add to api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);
```

This debugging guide should resolve your CORS and authentication issues. The key fixes are:
1. Proper CORS configuration with correct origins
2. Fixed server startup (no duplicate listeners)
3. Proper error handling and middleware setup
4. Environment variable configuration
5. Authentication middleware for protected routes

Follow these steps in order, and test each fix before moving to the next one.