import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      console.log("Fetching videos from:", `${API_BASE_URL}/videos`);
      try {
        const response = await axios.get(`${API_BASE_URL}/videos`, {
          headers: {
            Accept: 'application/json',
          },
        });

        const data = response.data;
        console.log("Raw data:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of videos");
        }

        setVideos(data);
      } catch (err) {
        console.error("useVideos error:", err.message);
        setError(err.message);
      }
    };

    fetchVideos();
  }, []);

  return { videos, error };
};

export default useVideos;
