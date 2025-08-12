import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
  logout: () => api.post('/auth/logout')
};

// Users API
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getFaculty: (params = {}) => api.get('/users/faculty', { params }),
  getStudents: (params = {}) => api.get('/users/students', { params }),
  getUsersByResearchArea: (area, params = {}) => 
    api.get(`/users/research-area/${area}`, { params }),
  getUserStats: () => api.get('/users/stats'),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deactivateUser: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.post(`/users/${id}/activate`)
};

// Articles API
export const articlesAPI = {
  getArticles: (params = {}) => api.get('/articles', { params }),
  getArticle: (id) => api.get(`/articles/${id}`),
  getFeaturedArticles: (params = {}) => api.get('/articles/featured', { params }),
  createArticle: (articleData) => api.post('/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
  likeArticle: (id) => api.post(`/articles/${id}/like`),
  addComment: (id, content) => api.post(`/articles/${id}/comment`, { content })
};

// Videos API
export const videosAPI = {
  getVideos: (params = {}) => api.get('/videos', { params }),
  getVideo: (id) => api.get(`/videos/${id}`),
  getVideoStats: () => api.get('/videos/stats'),
  syncVideos: (maxResults = 50) => api.post('/videos/sync', { maxResults }),
  updateVideo: (id, videoData) => api.put(`/videos/${id}`, videoData),
  deleteVideo: (id) => api.delete(`/videos/${id}`),
  trackAnalytics: (id, watchTime, clickThrough) => 
    api.post(`/videos/${id}/analytics`, { watchTime, clickThrough })
};

// Announcements API
export const announcementsAPI = {
  getAnnouncements: (params = {}) => api.get('/announcements', { params }),
  getAnnouncement: (id) => api.get(`/announcements/${id}`),
  getRecentAnnouncements: (params = {}) => api.get('/announcements/recent', { params }),
  createAnnouncement: (announcementData) => api.post('/announcements', announcementData),
  updateAnnouncement: (id, announcementData) => 
    api.put(`/announcements/${id}`, announcementData),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  likeAnnouncement: (id) => api.post(`/announcements/${id}/like`)
};

// Publications API
export const publicationsAPI = {
  getPublications: (params = {}) => api.get('/publications', { params }),
  getPublication: (id) => api.get(`/publications/${id}`),
  getFeaturedPublications: (params = {}) => api.get('/publications/featured', { params }),
  getRecentPublications: (params = {}) => api.get('/publications/recent', { params }),
  getPublicationStats: () => api.get('/publications/stats'),
  getPublicationsByAuthor: (userId, params = {}) => 
    api.get(`/publications/author/${userId}`, { params }),
  createPublication: (publicationData) => api.post('/publications', publicationData),
  updatePublication: (id, publicationData) => 
    api.put(`/publications/${id}`, publicationData),
  deletePublication: (id) => api.delete(`/publications/${id}`),
  trackDownload: (id) => api.post(`/publications/${id}/download`)
};

// Dashboard API (aggregated data)
export const dashboardAPI = {
  getOverview: async () => {
    try {
      const [
        recentAnnouncements,
        featuredArticles,
        recentPublications,
        userStats,
        videoStats
      ] = await Promise.all([
        announcementsAPI.getRecentAnnouncements({ limit: 5 }),
        articlesAPI.getFeaturedArticles({ limit: 5 }),
        publicationsAPI.getRecentPublications({ limit: 5 }),
        usersAPI.getUserStats(),
        videosAPI.getVideoStats()
      ]);

      return {
        success: true,
        data: {
          announcements: recentAnnouncements.data.data,
          articles: featuredArticles.data.data,
          publications: recentPublications.data.data,
          userStats: userStats.data.data,
          videoStats: videoStats.data.data
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch dashboard data'
      };
    }
  },

  getActivityFeed: async (limit = 10) => {
    try {
      // This would typically be a dedicated endpoint, but we'll aggregate for now
      const [announcements, articles] = await Promise.all([
        announcementsAPI.getRecentAnnouncements({ limit: limit / 2 }),
        articlesAPI.getFeaturedArticles({ limit: limit / 2 })
      ]);

      // Combine and sort by date
      const activities = [
        ...announcements.data.data.map(item => ({
          ...item,
          type: 'announcement',
          date: item.publishDate || item.createdAt
        })),
        ...articles.data.data.map(item => ({
          ...item,
          type: 'article',
          date: item.publishedDate || item.createdAt
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        success: true,
        data: activities.slice(0, limit)
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch activity feed'
      };
    }
  }
};

// Search API (cross-content search)
export const searchAPI = {
  searchAll: async (query, filters = {}) => {
    try {
      const { contentTypes = ['articles', 'publications', 'users'], limit = 20 } = filters;
      
      const searchPromises = [];
      
      if (contentTypes.includes('articles')) {
        searchPromises.push(
          articlesAPI.getArticles({ search: query, limit }).then(res => ({
            type: 'articles',
            data: res.data.data,
            total: res.data.pagination?.totalArticles || 0
          }))
        );
      }
      
      if (contentTypes.includes('publications')) {
        searchPromises.push(
          publicationsAPI.getPublications({ search: query, limit }).then(res => ({
            type: 'publications',
            data: res.data.data,
            total: res.data.pagination?.totalPublications || 0
          }))
        );
      }
      
      if (contentTypes.includes('users')) {
        searchPromises.push(
          usersAPI.getUsers({ search: query, limit }).then(res => ({
            type: 'users',
            data: res.data.data,
            total: res.data.pagination?.totalUsers || 0
          }))
        );
      }

      const results = await Promise.all(searchPromises);
      
      return {
        success: true,
        data: results,
        query
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Search failed'
      };
    }
  }
};

// Export the main api instance for direct use
export default api;