# API Specification - Deepminds Research Lab Portal

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://deepminds-research-lab-portal-backend.onrender.com/api`

## Authentication

### JWT Token Structure
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

### Headers Required for Protected Routes
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "visitor"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "visitor",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 900
  }
}
```

### POST /api/auth/login
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "visitor",
    "profileImage": "https://res.cloudinary.com/...",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_in": 900
  }
}
```

### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access_token": "...",
  "expires_in": 900
}
```

### POST /api/auth/logout
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### GET /api/auth/profile
Get current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "visitor",
  "profileImage": "https://res.cloudinary.com/...",
  "bio": "Research enthusiast...",
  "researchInterests": ["Machine Learning", "AI"],
  "publications": [...],
  "socialLinks": {...},
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/auth/profile
Update current user profile.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio...",
  "researchInterests": ["Deep Learning", "NLP"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johnsmith",
    "github": "https://github.com/johnsmith"
  }
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

## User Management Endpoints

### GET /api/users
Get all users with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role
- `search` (string): Search in name and email

**Response (200):**
```json
{
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": "research_member",
      "profileImage": "https://res.cloudinary.com/...",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/users/:id
Get specific user profile.

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "role": "research_member",
  "profileImage": "https://res.cloudinary.com/...",
  "bio": "Research enthusiast...",
  "researchInterests": ["Machine Learning"],
  "publications": [...],
  "socialLinks": {...},
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Forum Endpoints

### GET /api/forums
Get all forums.

**Response (200):**
```json
{
  "forums": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "General Discussion",
      "description": "General topics and discussions",
      "category": "general",
      "createdBy": {
        "_id": "...",
        "firstName": "Admin",
        "lastName": "User"
      },
      "threadCount": 25,
      "postCount": 150,
      "lastActivity": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/forums
Create new forum (Lab Director only).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Research Updates",
  "description": "Share your latest research findings",
  "category": "research",
  "isModerated": true
}
```

**Response (201):**
```json
{
  "message": "Forum created successfully",
  "forum": {...}
}
```

### GET /api/forums/:id/threads
Get threads in a forum.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort by 'latest', 'popular', 'oldest'

**Response (200):**
```json
{
  "threads": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Welcome to the forum",
      "content": "This is the first post...",
      "authorId": {
        "_id": "...",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "..."
      },
      "isPinned": true,
      "isLocked": false,
      "viewCount": 100,
      "postCount": 5,
      "tags": ["welcome", "introduction"],
      "lastPost": {
        "authorId": {...},
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/forums/:id/threads
Create new thread in forum.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "New Research Paper Discussion",
  "content": "I'd like to discuss this new paper...",
  "tags": ["research", "machine-learning"]
}
```

**Response (201):**
```json
{
  "message": "Thread created successfully",
  "thread": {...}
}
```

### GET /api/threads/:id
Get thread with posts.

**Query Parameters:**
- `page` (number): Page number for posts
- `limit` (number): Posts per page

**Response (200):**
```json
{
  "thread": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Research Discussion",
    "content": "Initial post content...",
    "authorId": {...},
    "forumId": {...},
    "viewCount": 50,
    "postCount": 10,
    "tags": ["research"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "posts": [
    {
      "_id": "...",
      "content": "Great discussion!",
      "authorId": {...},
      "parentPostId": null,
      "likes": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/threads/:id/posts
Create new post in thread.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "content": "This is my reply to the discussion...",
  "parentPostId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {...}
}
```

### PUT /api/posts/:id/like
Like/unlike a post.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Post liked successfully",
  "likesCount": 5,
  "isLiked": true
}
```

## Event Management Endpoints

### GET /api/events
Get all events with filtering.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by event type
- `status` (string): Filter by status
- `upcoming` (boolean): Show only upcoming events
- `search` (string): Search in title and description

**Response (200):**
```json
{
  "events": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "AI Research Seminar",
      "description": "Latest developments in AI...",
      "type": "seminar",
      "startDate": "2024-02-01T14:00:00.000Z",
      "endDate": "2024-02-01T16:00:00.000Z",
      "location": "Conference Room A",
      "organizerId": {...},
      "registeredUsers": [...],
      "maxAttendees": 50,
      "isPublic": true,
      "status": "upcoming",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/events
Create new event.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Machine Learning Workshop",
  "description": "Hands-on ML workshop for beginners",
  "type": "workshop",
  "startDate": "2024-02-15T10:00:00.000Z",
  "endDate": "2024-02-15T17:00:00.000Z",
  "location": "Lab Room 101",
  "meetingLink": "https://zoom.us/j/123456789",
  "maxAttendees": 30,
  "isPublic": true,
  "requiresApproval": false,
  "tags": ["machine-learning", "workshop"],
  "speakers": [
    {
      "name": "Dr. Jane Smith",
      "bio": "ML Expert with 10 years experience",
      "affiliation": "University XYZ"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Event created successfully",
  "event": {...}
}
```

### GET /api/events/:id
Get event details.

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "AI Research Seminar",
  "description": "Latest developments in AI...",
  "type": "seminar",
  "startDate": "2024-02-01T14:00:00.000Z",
  "endDate": "2024-02-01T16:00:00.000Z",
  "location": "Conference Room A",
  "meetingLink": "https://zoom.us/j/123456789",
  "organizerId": {...},
  "speakers": [...],
  "registeredUsers": [...],
  "maxAttendees": 50,
  "availableSpots": 25,
  "isPublic": true,
  "requiresApproval": false,
  "tags": ["ai", "research"],
  "attachments": [...],
  "status": "upcoming",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/events/:id/register
Register for an event.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "eventId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "status": "registered",
    "registeredAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### DELETE /api/events/:id/register
Unregister from an event.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Successfully unregistered from event"
}
```

## Project Endpoints

### GET /api/projects
Get all projects.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `search` (string): Search in title and description

**Response (200):**
```json
{
  "projects": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Network Intelligence System",
      "description": "AI system for network management...",
      "status": "active",
      "collaborators": [...],
      "images": [...],
      "fundingSource": "IITP",
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "technologies": ["Python", "TensorFlow", "Docker"],
      "tags": ["ai", "networking"],
      "isPublic": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/projects
Create new project.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "New Research Project",
  "description": "Exploring new frontiers in AI...",
  "status": "planning",
  "startDate": "2024-03-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "fundingSource": "NSF Grant",
  "fundingAmount": 100000,
  "technologies": ["Python", "PyTorch"],
  "tags": ["research", "ai"],
  "githubUrl": "https://github.com/lab/project",
  "isPublic": true
}
```

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {...}
}
```

## Resource Endpoints

### GET /api/resources
Get all resources.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by resource type
- `category` (string): Filter by category
- `difficulty` (string): Filter by difficulty
- `search` (string): Search in title and description

**Response (200):**
```json
{
  "resources": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Deep Learning Tutorial",
      "description": "Comprehensive guide to deep learning...",
      "type": "tutorial",
      "category": "deep_learning",
      "difficulty": "intermediate",
      "url": "https://example.com/tutorial",
      "fileUrl": "https://res.cloudinary.com/...",
      "uploadedBy": {...},
      "tags": ["deep-learning", "tutorial"],
      "downloadCount": 150,
      "likes": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/resources
Upload new resource.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body (multipart/form-data):**
```
title: "Machine Learning Basics"
description: "Introduction to ML concepts"
type: "tutorial"
category: "machine_learning"
difficulty: "beginner"
tags: ["ml", "basics"]
file: [binary file data]
```

**Response (201):**
```json
{
  "message": "Resource uploaded successfully",
  "resource": {...}
}
```

## Notification Endpoints

### GET /api/notifications
Get user notifications.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unread` (boolean): Show only unread notifications

**Response (200):**
```json
{
  "notifications": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "type": "forum_reply",
      "title": "New reply to your post",
      "message": "John Doe replied to your post in 'Research Discussion'",
      "relatedId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "relatedModel": "Post",
      "isRead": false,
      "actionUrl": "/forum/threads/64f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {...}
}
```

### PUT /api/notifications/:id/read
Mark notification as read.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

### PUT /api/notifications/read-all
Mark all notifications as read.

**Headers:** `Authorization: Bearer <access_token>`

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "updatedCount": 10
}
```

## Search Endpoints

### GET /api/search
Global search across all content.

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Content type filter ('articles', 'threads', 'events', 'projects', 'resources')
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "results": [
    {
      "type": "thread",
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Machine Learning Discussion",
      "excerpt": "This thread discusses the latest ML techniques...",
      "author": {...},
      "createdAt": "2024-01-01T00:00:00.000Z",
      "url": "/forum/threads/64f8a1b2c3d4e5f6a7b8c9d0"
    }
  ],
  "totalResults": 25,
  "pagination": {...}
}
```

## File Upload Endpoints

### POST /api/upload/image
Upload image to Cloudinary.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body (multipart/form-data):**
```
image: [binary image data]
folder: "profiles" // optional
```

**Response (200):**
```json
{
  "message": "Image uploaded successfully",
  "url": "https://res.cloudinary.com/...",
  "publicId": "profiles/user123_abc123"
}
```

### POST /api/upload/document
Upload document to Cloudinary.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body (multipart/form-data):**
```
document: [binary file data]
folder: "resources" // optional
```

**Response (200):**
```json
{
  "message": "Document uploaded successfully",
  "url": "https://res.cloudinary.com/...",
  "publicId": "resources/doc_abc123",
  "fileName": "research_paper.pdf",
  "fileSize": 2048576
}
```

## WebSocket Events

### Connection
```javascript
// Client connects to WebSocket
const socket = io('ws://localhost:5000', {
  auth: {
    token: 'Bearer <access_token>'
  }
});
```

### Events Emitted by Server
- `notification` - New notification for user
- `forum_update` - New post in subscribed thread
- `event_update` - Event registration/update
- `user_online` - User came online
- `user_offline` - User went offline

### Events Received by Server
- `join_thread` - Subscribe to thread updates
- `leave_thread` - Unsubscribe from thread updates
- `typing` - User is typing in thread
- `stop_typing` - User stopped typing

This comprehensive API specification provides all the endpoints needed to build the full-featured research lab portal with authentication, forums, events, projects, resources, and real-time features.