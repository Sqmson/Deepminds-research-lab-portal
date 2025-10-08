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

  return (
    <div style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e1e4e8', padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#111827' }}>Videos</h1>
            <p style={{ margin: '6px 0 0 0', color: '#6b7280' }}>Search, filter and explore lab videos and tutorials.</p>
          </div>
          <div style={{ width: '360px' }}>
            <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px' }}>
        <div>
          {loading && <p style={{ textAlign: 'center', color: '#586069' }}>Loading videos…</p>}
          {error && <p style={{ textAlign: 'center', color: '#d73a49' }}>Error: {error}</p>}

          {!loading && !error && (
            <>
              {filteredVideos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#586069' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#24292e' }}>No videos found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredVideos.map(video => (
                    <Link key={video._id} to={`/videos/${video._id}`} style={{ textDecoration: 'none' }}>
                      <VideoCard video={video} />
                    </Link>
                  ))}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', color: '#586069', fontSize: '0.9rem' }}>
                Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <div style={{ position: 'sticky', top: '20px' }}>
            <VideoFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            <div style={{ marginTop: '20px', padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e6e6e6' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>Summary</h4>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Total videos: <strong style={{ color: '#111827' }}>{videos.length}</strong>
              </div>
              <div style={{ marginTop: '8px', color: '#6b7280', fontSize: '14px' }}>
                Category: <strong style={{ color: '#111827' }}>{selectedCategory}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoListPage;