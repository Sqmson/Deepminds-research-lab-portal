// src/components/Videos/VideoList.jsx
import React, { useState } from 'react';

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}
    >
      {videos.map(video => (
        <VideoCard key={video._id} video={video} onClick={() => onVideoClick(video)} />
      ))}
    </div>
  );
};

const VideoCard = ({ video, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <div
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
        cursor: 'pointer',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMuted(true); // reset mute on leave
      }}
      onClick={onClick}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /*16:9 ratio*/ }}>
        {!hovered && (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            draggable={false}
          />
        )}

        {hovered && (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${video._id}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1`}
              title={video.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
            <button
              onClick={e => {
                e.stopPropagation();
                setMuted(!muted);
              }}
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: '#fff',
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
              aria-label={muted ? 'Unmute video' : 'Mute video'}
              title={muted ? 'Unmute video' : 'Mute video'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </>
        )}
      </div>
      <div style={{ padding: 12 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#24292e',
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={video.title}
        >
          {video.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: '#586069',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {video.author}
        </p>
        <p
          style={{
            fontSize: 12,
            color: '#888',
            marginTop: 2,
          }}
        >
          {new Date(video.uploadDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VideoList;
