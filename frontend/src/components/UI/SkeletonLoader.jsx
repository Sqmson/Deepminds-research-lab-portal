import React from 'react';

const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '',
  variant = 'rectangular'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: '50%',
          width: height,
          height: height
        };
      case 'text':
        return {
          height: '1em',
          borderRadius: '4px'
        };
      case 'rectangular':
      default:
        return {
          borderRadius,
          width,
          height
        };
    }
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={getVariantStyles()}
    />
  );
};

// Card Skeleton
export const CardSkeleton = ({ showImage = true, lines = 3 }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    {showImage && (
      <SkeletonLoader height="200px" className="rounded-lg" />
    )}
    <div className="space-y-3">
      <SkeletonLoader height="24px" width="80%" />
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLoader 
          key={index}
          height="16px" 
          width={index === lines - 1 ? '60%' : '100%'} 
        />
      ))}
    </div>
    <div className="flex items-center space-x-4 pt-2">
      <SkeletonLoader variant="circular" height="40px" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader height="14px" width="30%" />
        <SkeletonLoader height="12px" width="50%" />
      </div>
    </div>
  </div>
);

// Video Card Skeleton
export const VideoCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <SkeletonLoader height="200px" className="w-full" />
    <div className="p-4 space-y-3">
      <SkeletonLoader height="20px" width="90%" />
      <SkeletonLoader height="16px" width="70%" />
      <div className="flex items-center justify-between">
        <SkeletonLoader height="14px" width="40%" />
        <SkeletonLoader height="14px" width="30%" />
      </div>
    </div>
  </div>
);

// Article Card Skeleton
export const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="space-y-3">
      <SkeletonLoader height="24px" width="85%" />
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="75%" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex items-center space-x-3">
        <SkeletonLoader variant="circular" height="32px" />
        <div className="space-y-1">
          <SkeletonLoader height="14px" width="80px" />
          <SkeletonLoader height="12px" width="60px" />
        </div>
      </div>
      <SkeletonLoader height="12px" width="60px" />
    </div>
  </div>
);

// Announcement Skeleton
export const AnnouncementSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div className="flex items-start justify-between">
      <SkeletonLoader height="20px" width="70%" />
      <SkeletonLoader height="16px" width="60px" />
    </div>
    <SkeletonLoader height="16px" width="100%" />
    <SkeletonLoader height="16px" width="80%" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-2">
        <SkeletonLoader variant="circular" height="24px" />
        <SkeletonLoader height="12px" width="80px" />
      </div>
      <SkeletonLoader height="12px" width="50px" />
    </div>
  </div>
);

// Publication Skeleton
export const PublicationSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="space-y-2">
      <SkeletonLoader height="22px" width="90%" />
      <SkeletonLoader height="14px" width="60%" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="70%" />
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <SkeletonLoader height="14px" width="40%" />
      <div className="flex items-center space-x-4">
        <SkeletonLoader height="12px" width="30px" />
        <SkeletonLoader height="12px" width="40px" />
      </div>
    </div>
  </div>
);

// User Profile Skeleton
export const UserProfileSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <SkeletonLoader variant="circular" height="64px" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader height="20px" width="60%" />
        <SkeletonLoader height="16px" width="40%" />
        <SkeletonLoader height="14px" width="80%" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="85%" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonLoader 
          key={index}
          height="24px" 
          width="80px" 
          className="rounded-full"
        />
      ))}
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ 
  items = 5, 
  itemHeight = '60px',
  showAvatar = true 
}) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        {showAvatar && (
          <SkeletonLoader variant="circular" height="48px" />
        )}
        <div className="flex-1 space-y-2">
          <SkeletonLoader height="18px" width="70%" />
          <SkeletonLoader height="14px" width="50%" />
        </div>
        <SkeletonLoader height="12px" width="60px" />
      </div>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    {/* Header */}
    <div className="border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonLoader key={index} height="16px" width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonLoader 
                key={colIndex} 
                height="16px" 
                width={colIndex === 0 ? '90%' : '70%'} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Stats Skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonLoader height="16px" width="60%" />
          <SkeletonLoader variant="circular" height="32px" />
        </div>
        <SkeletonLoader height="32px" width="40%" />
        <SkeletonLoader height="12px" width="80%" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;