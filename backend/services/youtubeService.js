const axios = require('axios');
const Video = require('../models/Video');

class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.channelId = process.env.YOUTUBE_CHANNEL_ID;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    
    if (!this.apiKey || !this.channelId) {
      console.warn('⚠️ YouTube API credentials not found. Video features may not work properly.');
    }
  }

  /**
   * Fetch videos from YouTube channel and sync with database
   */
  async syncChannelVideos(maxResults = 50) {
    try {
      console.log('🔄 Syncing videos from YouTube channel...');
      
      // Fetch videos from YouTube API
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          key: this.apiKey,
          channelId: this.channelId,
          part: 'snippet',
          order: 'date',
          maxResults,
          type: 'video'
        }
      });

      const videoIds = response.data.items.map(item => item.id.videoId);
      
      if (videoIds.length === 0) {
        console.log('📹 No videos found in channel');
        return [];
      }

      // Get detailed video information
      const detailsResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          key: this.apiKey,
          id: videoIds.join(','),
          part: 'snippet,contentDetails,statistics'
        }
      });

      const syncedVideos = [];
      
      for (const videoData of detailsResponse.data.items) {
        try {
          const videoDoc = await this.saveOrUpdateVideo(videoData);
          syncedVideos.push(videoDoc);
        } catch (error) {
          console.error(`❌ Error syncing video ${videoData.id}:`, error.message);
        }
      }

      console.log(`✅ Synced ${syncedVideos.length} videos successfully`);
      return syncedVideos;
      
    } catch (error) {
      console.error('❌ Error syncing YouTube videos:', error.message);
      throw new Error(`Failed to sync videos: ${error.message}`);
    }
  }

  /**
   * Save or update a single video in the database
   */
  async saveOrUpdateVideo(videoData) {
    const {
      id,
      snippet,
      contentDetails,
      statistics
    } = videoData;

    // Extract and categorize video based on title/description
    const category = this.categorizeVideo(snippet.title, snippet.description);
    const researchArea = this.determineResearchArea(snippet.title, snippet.description);
    const tags = this.extractTags(snippet.title, snippet.description, snippet.tags);

    const videoDoc = {
      youtubeId: id,
      title: snippet.title,
      description: snippet.description || '',
      channelId: snippet.channelId,
      channelTitle: snippet.channelTitle,
      thumbnails: snippet.thumbnails,
      publishedAt: new Date(snippet.publishedAt),
      duration: contentDetails?.duration || null,
      viewCount: parseInt(statistics?.viewCount) || 0,
      likeCount: parseInt(statistics?.likeCount) || 0,
      commentCount: parseInt(statistics?.commentCount) || 0,
      category,
      researchArea,
      tags,
      lastSynced: new Date(),
      isActive: true
    };

    // Check if video already exists
    const existingVideo = await Video.findOne({ youtubeId: id });
    
    if (existingVideo) {
      // Update existing video
      Object.assign(existingVideo, videoDoc);
      return await existingVideo.save();
    } else {
      // Create new video
      return await Video.create(videoDoc);
    }
  }

  /**
   * Search videos using YouTube API
   */
  async searchYouTubeVideos(query, options = {}) {
    try {
      const {
        maxResults = 25,
        order = 'relevance',
        publishedAfter,
        publishedBefore
      } = options;

      const params = {
        key: this.apiKey,
        channelId: this.channelId,
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        order
      };

      if (publishedAfter) {
        params.publishedAfter = publishedAfter;
      }
      
      if (publishedBefore) {
        params.publishedBefore = publishedBefore;
      }

      const response = await axios.get(`${this.baseUrl}/search`, { params });
      
      return response.data.items.map(item => ({
        youtubeId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
      }));
      
    } catch (error) {
      console.error('❌ Error searching YouTube videos:', error.message);
      throw new Error(`YouTube search failed: ${error.message}`);
    }
  }

  /**
   * Get video details by YouTube ID and save to database
   */
  async getVideoDetails(youtubeId) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          key: this.apiKey,
          id: youtubeId,
          part: 'snippet,contentDetails,statistics'
        }
      });

      if (response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const videoData = response.data.items[0];
      return await this.saveOrUpdateVideo(videoData);
      
    } catch (error) {
      console.error(`❌ Error fetching video details for ${youtubeId}:`, error.message);
      throw error;
    }
  }

  /**
   * Categorize video based on content
   */
  categorizeVideo(title, description) {
    const content = `${title} ${description}`.toLowerCase();
    
    if (content.includes('tutorial') || content.includes('how to') || content.includes('guide')) {
      return 'Tutorial';
    }
    
    if (content.includes('research') || content.includes('paper') || content.includes('study')) {
      return 'Research';
    }
    
    if (content.includes('seminar') || content.includes('lecture') || content.includes('presentation')) {
      return 'Seminar';
    }
    
    if (content.includes('workshop') || content.includes('hands-on') || content.includes('practical')) {
      return 'Workshop';
    }
    
    if (content.includes('lab') || content.includes('experiment') || content.includes('demo')) {
      return 'Lab Work';
    }
    
    return 'Discussion';
  }

  /**
   * Determine research area based on content
   */
  determineResearchArea(title, description) {
    const content = `${title} ${description}`.toLowerCase();
    
    if (content.match(/\b(ai|artificial intelligence|machine learning|ml|deep learning|neural network)\b/)) {
      return 'AI/ML';
    }
    
    if (content.match(/\b(computer vision|cv|image processing|object detection|recognition)\b/)) {
      return 'Computer Vision';
    }
    
    if (content.match(/\b(nlp|natural language|text processing|language model|chatbot)\b/)) {
      return 'NLP';
    }
    
    if (content.match(/\b(robot|robotics|automation|control system)\b/)) {
      return 'Robotics';
    }
    
    if (content.match(/\b(data science|analytics|big data|statistics|visualization)\b/)) {
      return 'Data Science';
    }
    
    return 'Other';
  }

  /**
   * Extract relevant tags from content
   */
  extractTags(title, description, youtubeTags = []) {
    const tags = new Set();
    
    // Add YouTube tags if available
    if (youtubeTags && Array.isArray(youtubeTags)) {
      youtubeTags.forEach(tag => tags.add(tag.toLowerCase()));
    }
    
    // Extract technical terms
    const content = `${title} ${description}`.toLowerCase();
    const technicalTerms = [
      'ai', 'ml', 'deep learning', 'neural network', 'computer vision',
      'nlp', 'robotics', 'data science', 'python', 'tensorflow', 'pytorch',
      'research', 'algorithm', 'model', 'training', 'dataset'
    ];
    
    technicalTerms.forEach(term => {
      if (content.includes(term)) {
        tags.add(term);
      }
    });
    
    // Limit to 10 most relevant tags
    return Array.from(tags).slice(0, 10);
  }

  /**
   * Get channel statistics
   */
  async getChannelStats() {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          key: this.apiKey,
          id: this.channelId,
          part: 'statistics,snippet'
        }
      });

      if (response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = response.data.items[0];
      return {
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        viewCount: parseInt(channel.statistics.viewCount) || 0,
        publishedAt: channel.snippet.publishedAt
      };
      
    } catch (error) {
      console.error('❌ Error fetching channel stats:', error.message);
      throw error;
    }
  }

  /**
   * Validate API credentials
   */
  async validateCredentials() {
    try {
      await axios.get(`${this.baseUrl}/channels`, {
        params: {
          key: this.apiKey,
          id: this.channelId,
          part: 'snippet'
        }
      });
      return true;
    } catch (error) {
      console.error('❌ Invalid YouTube API credentials:', error.message);
      return false;
    }
  }
}

module.exports = new YouTubeService();