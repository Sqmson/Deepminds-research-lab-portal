import React from 'react';
import VideoCard from './VideoCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const VideoList = ({
  videos = [],
  loading = false,
  error = null,
  layout = 'grid',
  pagination = null,
  onVideoClick,
  onPageChange,
  showPreview = true,
  emptyStateMessage = "No videos found",
  emptyStateDescription = "Try adjusting your search or filters to find more videos."
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading videos...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Videos</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyStateMessage}</h3>
        <p className="text-gray-600 text-center max-w-md">{emptyStateDescription}</p>
      </div>
    );
  }

  // Grid layout classes
  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'space-y-4';

  return (
    <div className="w-full">
      {/* Video Grid/List */}
      <div className={gridClasses}>
        {videos.map((video) => (
          <VideoCard
            key={video.youtubeId || video._id}
            video={video}
            onClick={onVideoClick}
            layout={layout}
            showPreview={showPreview}
            className="h-full"
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          {/* Results Info */}
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {((pagination.currentPage - 1) * pagination.limit) + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalVideos)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{pagination.totalVideos}</span>{' '}
            results
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pagination.hasPrevPage
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers(pagination.currentPage, pagination.totalPages).map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={pageNum === pagination.currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pagination.hasNextPage
                  ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              }`}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Load More Button (alternative to pagination) */}
      {pagination && pagination.hasNextPage && !pagination.totalPages && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onPageChange?.(pagination.currentPage + 1)}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Videos'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to generate page numbers with ellipsis
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
};

export default VideoList;