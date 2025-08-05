import React, { useState, useRef } from 'react';
import { Play, Calendar, Eye, Clock, Volume2, VolumeX } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  const {
    title,
    description,
    tags = [],
    author,
    // authorAvatar removed, fallback to generic avatar if needed
    category,
    thumbnail,
    videoUrl,
    uploadDate,
    duration,
    views
  } = video;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && isLoaded) {
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      onClick={() => onClick(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        border: '1px solid #d1d5da',
        borderRadius: '16px',
        padding: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#ffffff',
        boxShadow: isHovered
          ? '0 4px 12px rgba(0, 0, 0, 0.1)'
          : '0 2px 6px rgba(0, 0, 0, 0.05)',
        maxWidth: '600px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
    >
      {/* Video Container */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#f6f8fa',
        borderRadius: '12px',
        marginBottom: '0.75rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Thumbnail */}
        {!isHovered && (
          <img
            src={thumbnail}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )}

        {/* Fallback */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f1f3f4',
          display: !isHovered && !thumbnail ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          opacity: 0.7
        }}>
          🎥
        </div>

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />

        {/* Play Button Overlay */}
        {!isHovered && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Play size={24} color="white" style={{ marginLeft: '3px' }} />
          </div>
        )}

        {/* Mute Button */}
        {isHovered && (
          <button
            onClick={toggleMute}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.9)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
          >
            {isMuted ? <VolumeX size={16} color="white" /> : <Volume2 size={16} color="white" />}
          </button>
        )}

        {/* Duration Badge */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock size={12} />
          {duration}
        </div>
      </div>

      {/* Video Info */}
      <h2 style={{
        fontSize: '1.25rem',
        marginBottom: '0.5rem',
        color: '#24292e',
        fontWeight: '600',
        lineHeight: '1.3'
      }}>
        {title}
      </h2>

      <p style={{
        color: '#586069',
        fontSize: '0.95rem',
        marginBottom: '0.75rem',
        lineHeight: '1.4'
      }}>
        {description}
      </p>

      {/* Meta Info */}
      <div style={{
        fontSize: '0.8rem',
        color: '#586069',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1rem' }}>👤</span>
          <strong style={{ color: '#24292e' }}>{author}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={12} />
          {new Date(uploadDate).toDateString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={12} />
          {views} views
        </div>
        <span style={{
          backgroundColor: '#f1f3f4',
          color: '#586069',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px'
        }}>
          {category}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tags.map((tag, i) => (
          <span
            key={i}
            style={{
              backgroundColor: '#e0e7ff',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: '#1e40af'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VideoCard;