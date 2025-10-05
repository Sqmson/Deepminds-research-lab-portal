// API Module - Handles all API communications
class ApiService {
    constructor() {
        // Use backend server URL for API calls
        this.baseURL = 'http://localhost:8001';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generic fetch with error handling and caching
     */
    async fetchWithCache(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error (${endpoint}):`, response.status, response.statusText, errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Check content type
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                const body = await response.text();
                console.error(`Expected JSON but got ${contentType}:`, body);
                throw new Error(`Invalid JSON response: ${body.substring(0, 200)}...`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }

            // Cache successful responses
            this.cache.set(cacheKey, {
                data: data.data,
                timestamp: Date.now()
            });

            return data.data;

        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    /**
     * Get articles with optional filtering
     */
    async getArticles(filters = {}) {
        const params = new URLSearchParams();

        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }

        if (filters.search) {
            params.append('search', filters.search);
        }

        if (filters.page) {
            params.append('page', filters.page);
        }

        if (filters.limit) {
            params.append('limit', filters.limit);
        }

        const queryString = params.toString();
        const endpoint = `/api/articles${queryString ? '?' + queryString : ''}`;

        return this.fetchWithCache(endpoint);
    }

    /**
     * Get single article by ID
     */
    async getArticle(id) {
        if (!id) throw new Error('Article ID is required');
        return this.fetchWithCache(`/api/articles/${id}`);
    }

    /**
     * Get article categories
     */
    async getCategories() {
        return this.fetchWithCache('/api/articles/categories');
    }

    /**
     * Create new article
     */
    async createArticle(articleData) {
        return this.fetchWithCache('/api/articles', {
            method: 'POST',
            body: JSON.stringify(articleData)
        });
    }

    /**
     * Get videos from YouTube
     */
    async getVideos(search = '') {
        const params = new URLSearchParams();
        if (search) {
            params.append('search', search);
        }

        const queryString = params.toString();
        const endpoint = `/api/videos${queryString ? '?' + queryString : ''}`;

        return this.fetchWithCache(endpoint);
    }

    /**
     * Get single video by ID
     */
    async getVideo(id) {
        if (!id) throw new Error('Video ID is required');
        return this.fetchWithCache(`/api/videos/${id}`);
    }

    /**
     * Clear cache (useful for development or forced refresh)
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Global API instance
window.api = new ApiService();