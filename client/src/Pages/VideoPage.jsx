import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPage/VideoPlayer";
import VideoInfo from "../components/VideoPage/VideoInfo";
import RelatedVideos from "../components/VideoPage/RelatedVideos";
import API_BASE from '../utils/api';

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
        const res = await fetch(`${API_BASE}/videos/${id}`);
        if (!res.ok) throw new Error("Video not found");
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
    // Fetch related videos from server-side related endpoint
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/${id}/related`);
        if (!res.ok) throw new Error('Failed to load related');
        const data = await res.json();
        setRelatedVideos(data || []);
      } catch (e) {
        // ignore
      }
    };
    if (id) fetchRelated();
  }, [id]);

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        Error loading video: {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>Loading video...</div>
    );
  }
  if (!videoData) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        Video not found.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
  <VideoPlayer videoId={videoData._id} duration={videoData.duration} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "30px",
          }}
        >
          <div>
            <VideoInfo videoData={videoData} />
          </div>
          <RelatedVideos videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
