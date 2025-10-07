import React from 'react';

const VideoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #d1d5da',
          backgroundColor: '#ffffff'
        }}
      />
      <span style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#586069',
        pointerEvents: 'none'
      }}>
        🔍
      </span>
    </div>
  );
};

export default VideoSearch;
