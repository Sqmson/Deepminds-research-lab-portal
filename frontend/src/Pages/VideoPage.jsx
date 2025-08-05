import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPage/VideoPlayer';
import VideoInfo from '../components/VideoPage/VideoInfo';
import RelatedVideos from '../components/VideoPage/RelatedVideos';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VideoPage = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/videos/${id}`);
        if (!res.ok) throw new Error('Video not found');
        const data = await res.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  useEffect(() => {
    // Fetch related videos (excluding current)
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/videos`);
        const data = await res.json();
        setRelatedVideos(data.filter(v => v._id !== id).slice(0, 5));
      } catch { }
    };
    if (id) fetchRelated();
  }, [id]);

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Error loading video: {error}</div>;
  }
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading video...</div>;
  }
  if (!videoData) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Video not found.</div>;
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <VideoPlayer
          videoId={videoData._id}
          duration={videoData.duration}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '30px'
        }}>
          <div>
            <VideoInfo
              title={videoData.title}
              views={videoData.views}
              likes={videoData.likes}
              uploadDate={videoData.uploadDate}
              dislikes={videoData.dislikes}
              category={videoData.category}
            />
          </div>
          <RelatedVideos videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;