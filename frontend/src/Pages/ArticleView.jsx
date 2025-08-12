import React, { useState } from 'react';
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
  Edit,
  Trash2
} from 'lucide-react';
import { articlesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import toast from 'react-hot-toast';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Fetch article data
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getArticle(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch related articles
  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.data?.tags],
    queryFn: () => articlesAPI.getArticles({ 
      tags: article?.data?.tags?.slice(0, 3),
      limit: 3,
      exclude: id 
    }),
    enabled: !!article?.data?.tags?.length,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => articlesAPI.likeArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['article', id]);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Article unliked' : 'Article liked!');
    },
    onError: () => {
      toast.error('Failed to update like status');
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (comment) => articlesAPI.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['article', id]);
      setNewComment('');
      toast.success('Comment added successfully!');
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => articlesAPI.deleteArticle(id),
    onSuccess: () => {
      toast.success('Article deleted successfully!');
      navigate('/articles');
    },
    onError: () => {
      toast.error('Failed to delete article');
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like articles');
      return;
    }
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark articles');
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Bookmark removed' : 'Article bookmarked!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.data?.title,
          text: article?.data?.excerpt,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
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
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate();
    }
  };

  const canEdit = user && (user.role === 'admin' || user.role === 'professor' || user._id === article?.data?.author?._id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !article?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/articles"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const articleData = article.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Articles
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {articleData.featuredImage && (
            <div className="aspect-video bg-gray-200">
              <img
                src={articleData.featuredImage}
                alt={articleData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(articleData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  {articleData.author?.firstName} {articleData.author?.lastName}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {Math.ceil(articleData.content?.split(' ').length / 200) || 5} min read
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {articleData.views || 0} views
                </div>
              </div>

              {/* Edit/Delete Actions */}
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/articles/${id}/edit`}
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

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {articleData.title}
            </h1>

            {/* Excerpt */}
            {articleData.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {articleData.excerpt}
              </p>
            )}

            {/* Tags */}
            {articleData.tags && articleData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {articleData.tags.map((tag, index) => (
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

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked || articleData.likes?.includes(user?._id)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isLiked || articleData.likes?.includes(user?._id) ? 'fill-current' : ''} />
                {articleData.likes?.length || 0}
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <MessageCircle size={16} />
                {articleData.comments?.length || 0}
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
                Bookmark
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: articleData.content }}
                className="text-gray-800 leading-relaxed"
              />
            </div>
          </div>
        </article>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Comments ({articleData.comments?.length || 0})
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
              {articleData.comments?.map((comment) => (
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

        {/* Related Articles */}
        {relatedArticles?.data?.data?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.data.data.map((relatedArticle) => (
                <Link
                  key={relatedArticle._id}
                  to={`/articles/${relatedArticle._id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {relatedArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(relatedArticle.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;