import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark,
  MessageCircle,
  Tag,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { videosAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import toast from 'react-hot-toast';

const VideoView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const videoRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [_isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Fetch video data
  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', slug],
    queryFn: () => videosAPI.getVideo(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch related videos
  const { data: relatedVideos } = useQuery({
    queryKey: ['related-videos', video?.data?.tags],
    queryFn: () => videosAPI.getVideos({ 
      tags: video?.data?.tags?.slice(0, 3),
      limit: 4,
      exclude: slug
    }),
    enabled: !!video?.data?.tags?.length,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => videosAPI.likeVideo(slug),
    onSuccess: () => {
      queryClient.invalidateQueries(['video', slug]);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Video unliked' : 'Video liked!');
    },
    onError: () => {
      toast.error('Failed to update like status');
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (comment) => videosAPI.addComment(slug, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['video', slug]);
      setNewComment('');
      toast.success('Comment added successfully!');
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => videosAPI.deleteVideo(slug),
    onSuccess: () => {
      toast.success('Video deleted successfully!');
      navigate('/videos');
    },
    onError: () => {
      toast.error('Failed to delete video');
    }
  });

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [video?.data]);

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like videos');
      return;
    }
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark videos');
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Video bookmarked!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.data?.title,
          text: video?.data?.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Video link copied to clipboard!');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    commentMutation.mutate({ content: newComment });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate();
    }
  };

  const canEdit = user && (user.role === 'admin' || user.role === 'professor' || user._id === video?.data?.uploader?._id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !video?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h1>
          <p className="text-gray-600 mb-6">The video you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/videos"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  const videoData = video.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Videos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div 
              className="relative bg-black rounded-lg overflow-hidden aspect-video mb-6"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <iframe
                ref={videoRef}
                src={videoData.embedUrl}
                title={videoData.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Video Controls */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}>
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute}>
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>

                      <span className="text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button>
                        <Settings size={20} />
                      </button>
                      <button onClick={toggleFullscreen}>
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Title and Actions */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-4">
                  {videoData.title}
                </h1>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/videos/${slug}/edit`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {videoData.views || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(videoData.uploadDate || videoData.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {videoData.uploader?.firstName} {videoData.uploader?.lastName}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked || videoData.likes?.includes(user?._id)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={16} className={isLiked || videoData.likes?.includes(user?._id) ? 'fill-current' : ''} />
                  {videoData.likes?.length || 0}
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle size={16} />
                  {videoData.comments?.length || 0}
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isBookmarked
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  Save
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 size={16} />
                  Share
                </button>

                {videoData.downloadUrl && (
                  <a
                    href={videoData.downloadUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                )}
              </div>

              {/* Description */}
              {videoData.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {videoData.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {videoData.tags && videoData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {videoData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Comments ({videoData.comments?.length || 0})
                </h3>

                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleAddComment} className="mb-6">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={commentMutation.isPending || !newComment.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-2">Please login to comment</p>
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {videoData.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-sm font-medium">
                          {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.author?.firstName} {comment.author?.lastName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Videos</h3>
              <div className="space-y-4">
                {relatedVideos?.data?.data?.map((relatedVideo) => (
                  <Link
                    key={relatedVideo._id}
                    to={`/videos/${relatedVideo.slug}`}
                    className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {relatedVideo.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye size={12} />
                        {relatedVideo.views || 0} views
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;