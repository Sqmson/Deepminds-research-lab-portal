import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import VideoSearch from "../components/Videos/VideoSearch";
import VideoList from "../components/Videos/VideoList";
import useVideos from "../hooks/useVideos";

const VideoListePage = () => {
  const navigate = useNavigate();
  const [searchOptions, setSearchOptions] = useState({
    search: '',
    category: 'All',
    researchArea: 'All',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [layout, setLayout] = useState('grid');

  const { videos, loading, error, pagination, filters } = useVideos(searchOptions);

  const handleSearch = useCallback((searchTerm) => {
    setSearchOptions(prev => ({
      ...prev,
      search: searchTerm,
      page: 1 // Reset to first page on new search
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setSearchOptions(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page on filter change
    }));
  }, []);

  const handleSortChange = useCallback((sortBy, sortOrder) => {
    setSearchOptions(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1 // Reset to first page on sort change
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setSearchOptions(prev => ({
      ...prev,
      page
    }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleVideoClick = useCallback((video) => {
    navigate(`/videos/${video.slug}`);
  }, [navigate]);

  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filters */}
      <VideoSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onLayoutChange={handleLayoutChange}
        filters={searchOptions}
        currentLayout={layout}
        availableCategories={filters?.categories || []}
        availableResearchAreas={filters?.researchAreas || []}
        isLoading={loading}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Videos Section */}
        {!searchOptions.search && searchOptions.category === 'All' && searchOptions.page === 1 && (
          <FeaturedVideosSection onVideoClick={handleVideoClick} />
        )}

        {/* Video List */}
        <div className={searchOptions.search || searchOptions.category !== 'All' ? '' : 'mt-12'}>
          <VideoList
            videos={videos}
            loading={loading}
            error={error}
            layout={layout}
            pagination={pagination}
            onVideoClick={handleVideoClick}
            onPageChange={handlePageChange}
            showPreview={true}
            emptyStateMessage={
              searchOptions.search
                ? `No videos found for "${searchOptions.search}"`
                : "No videos available"
            }
            emptyStateDescription={
              searchOptions.search
                ? "Try adjusting your search terms or filters to find more videos."
                : "Videos will appear here once they are synced from the YouTube channel."
            }
          />
        </div>
      </div>

    </div>
  );
};

// Featured Videos Section Component
const FeaturedVideosSection = ({ onVideoClick }) => {
  const { videos: featuredVideos, loading } = useVideos({ featured: 'true', limit: 4 });

  if (loading || !featuredVideos || featuredVideos.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Videos</h2>
        <div className="h-px bg-gradient-to-r from-blue-600 to-transparent flex-1 ml-6"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredVideos.map((video) => (
          <div key={video.youtubeId} className="relative">
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10">
              Featured
            </div>
            <VideoCard
              video={video}
              onClick={onVideoClick}
              layout="grid"
              showPreview={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};


export default VideoListePage;
