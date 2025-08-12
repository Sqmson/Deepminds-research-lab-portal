import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useVideos = (initialOptions = {}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);

  const fetchVideos = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Add search and filter parameters
      if (options.search) params.append('search', options.search);
      if (options.category && options.category !== 'All') params.append('category', options.category);
      if (options.researchArea && options.researchArea !== 'All') params.append('researchArea', options.researchArea);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.featured) params.append('featured', options.featured);

      const response = await axios.get(`${API_BASE_URL}/videos?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch videos');
      }

      setVideos(response.data.data || []);
      setPagination(response.data.pagination || null);
      setFilters(response.data.filters || null);

    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVideos(initialOptions);
  }, [fetchVideos, initialOptions]);

  const refetch = useCallback((newOptions = {}) => {
    return fetchVideos({ ...initialOptions, ...newOptions });
  }, [fetchVideos, initialOptions]);

  return {
    videos,
    loading,
    error,
    pagination,
    filters,
    refetch
  };
};

// Hook for single video
export const useVideo = (videoId) => {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch video');
        }

        setVideo(response.data.data.video);
        setRelatedVideos(response.data.data.relatedVideos || []);

      } catch (err) {
        console.error('Error fetching video:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const trackAnalytics = useCallback(async (watchTime, clickThrough = false) => {
    if (!videoId) return;

    try {
      await axios.post(`${API_BASE_URL}/videos/${videoId}/analytics`, {
        watchTime,
        clickThrough
      });
    } catch (err) {
      console.warn('Failed to track analytics:', err);
    }
  }, [videoId]);

  return {
    video,
    relatedVideos,
    loading,
    error,
    trackAnalytics
  };
};

// Hook for video statistics
export const useVideoStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/videos/stats`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch stats');
        }

        setStats(response.data.data);

      } catch (err) {
        console.error('Error fetching video stats:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useVideos;