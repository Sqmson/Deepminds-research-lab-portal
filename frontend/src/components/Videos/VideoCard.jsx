import React, { useState, useRef, useEffect } from "react";
import { Play, Volume2, VolumeX, MoreVertical, Clock, Eye, Calendar, Tag } from "lucide-react";

const VideoCard = ({
  video,
  onClick,
  layout = 'grid', // 'grid' or 'list'
  showPreview = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const {
    youtubeId,
    title,
    channelTitle,
    bestThumbnail,
    publishedAt,
    viewCount,
    formattedDuration,
    description,
    category,
    researchArea,
    tags = [],
    embedUrl,
    localViews = 0
  } = video;

  const handleMouseEnter = () => {
    if (!showPreview) return;
    
    // Delay preview to avoid accidental triggers
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      setIsPlaying(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    setIsPlaying(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(video);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const formatViews = (count) => {
    if (!count || count === 0) return "No views";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getThumbnailUrl = () => {
    return bestThumbnail || `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const cardClasses = `
    group cursor-pointer transition-all duration-300 ease-in-out
    ${layout === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'}
    ${isHovered ? 'transform scale-105 shadow-2xl' : 'hover:shadow-lg'}
    bg-white rounded-lg border border-gray-200 hover:border-gray-300
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${className}
  `;

  const thumbnailClasses = `
    relative overflow-hidden rounded-lg bg-gray-100
    ${layout === 'list' ? 'w-48 h-28 flex-shrink-0' : 'w-full aspect-video'}
  `;

  return (
    <article
      className={cardClasses}
      onClick={() => onClick?.(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Play video: ${title}`}
    >
      {/* Thumbnail Container */}
      <div className={thumbnailClasses}>
        {/* Thumbnail Image */}
        {!imageError && (
          <img
            src={getThumbnailUrl()}
            alt={`Thumbnail for ${title}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Fallback for missing thumbnail */}
        {imageError && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Play size={48} />
          </div>
        )}

        {/* YouTube Embed Preview */}
        {isHovered && showPreview && isPlaying && (
          <div className="absolute inset-0 bg-black">
            <iframe
              src={`${embedUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1&start=10`}
              title={`Preview of ${title}`}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              loading="lazy"
            />
          </div>
        )}

        {/* Play Button Overlay */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-red-600 text-white rounded-full p-3 transform scale-100 group-hover:scale-110 transition-transform duration-200">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {formattedDuration && formattedDuration !== "N/A" && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock size={10} />
            {formattedDuration}
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </div>
        )}

        {/* Mute Toggle Button */}
        {isHovered && showPreview && (
          <button
            onClick={toggleMute}
            className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isMuted ? "Unmute preview" : "Mute preview"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        )}
      </div>

      {/* Video Info Container */}
      <div className={`flex-1 ${layout === 'list' ? '' : 'p-4'}`}>
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Channel and Meta Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span className="font-medium text-gray-700">{channelTitle}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{formatViews(viewCount + localViews)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>

        {/* Description (only in list layout) */}
        {layout === 'list' && description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Tags and Research Area */}
        <div className="flex items-center gap-2 flex-wrap">
          {researchArea && researchArea !== 'Other' && (
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              <Tag size={10} />
              {researchArea}
            </span>
          )}
          {tags.slice(0, layout === 'list' ? 3 : 2).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {tags.length > (layout === 'list' ? 3 : 2) && (
            <span className="text-xs text-gray-400">
              +{tags.length - (layout === 'list' ? 3 : 2)} more
            </span>
          )}
        </div>
      </div>

      {/* More Options Button */}
      <div className={`${layout === 'list' ? 'self-start' : 'absolute top-2 right-2'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options menu
          }}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="More options"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </article>
  );
};

export default VideoCard;
