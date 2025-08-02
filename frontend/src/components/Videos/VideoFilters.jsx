import React from 'react';

const VideoFilters = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Research', 'Tutorial', 'Discussion', 'Lab Work'];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid #d1d5da',
            backgroundColor: selectedCategory === category ? '#0366d6' : '#ffffff',
            color: selectedCategory === category ? 'white' : '#586069',
            cursor: 'pointer',
            fontWeight: selectedCategory === category ? '600' : 'normal',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category) {
              e.target.style.backgroundColor = '#f6f8fa';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category) {
              e.target.style.backgroundColor = '#ffffff';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default VideoFilters;