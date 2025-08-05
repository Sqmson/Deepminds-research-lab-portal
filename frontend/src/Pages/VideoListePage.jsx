import React, { useState, useEffect } from 'react';
import VideoSearch from '../components/Videos/VideoSearch';
import VideoFilters from '../components/Videos/VideoFilters';
import VideoCard from '../components/Videos/VideoCard';
import { Link } from 'react-router-dom';
import useVideos from '../hooks/useVideos';

const VideoListPage = () => {
  const { videos, loading, error } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    let filtered = videos;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory]);

  // Navigation handled by <Link> wrapping each VideoCard

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e1e4e8',
        padding: '32px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>

          <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <VideoFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {loading && (
          <p style={{ textAlign: 'center', color: '#586069' }}>Loading videos...</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#d73a49' }}>Error: {error}</p>
        )}

        {!loading && !error && (
          <>
            {filteredVideos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#586069'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#24292e' }}>
                  No videos found
                </h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredVideos.map(video => (
                <Link key={video._id} to={`/videos/${video._id}`}>
                  <VideoCard video={video} />
                </Link>
              ))
            )}

            {/* Results Summary */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              padding: '1rem',
              color: '#586069',
              fontSize: '0.9rem'
            }}>
              Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoListPage;