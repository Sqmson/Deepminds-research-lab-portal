import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  Search, 
  Filter,
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  ChevronDown,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { announcementsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AnnouncementSkeleton } from '../components/UI/SkeletonLoader';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', { priority: selectedPriority, audience: selectedAudience }],
    queryFn: () => announcementsAPI.getAnnouncements({ 
      priority: selectedPriority !== 'all' ? selectedPriority : undefined,
      audience: selectedAudience !== 'all' ? selectedAudience : undefined,
      limit: 50 
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter announcements based on search
  const filteredAnnouncements = announcements?.data?.data?.filter(announcement => {
    const matchesSearch = searchTerm === '' || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const priorityIcons = {
    high: AlertCircle,
    medium: Info,
    low: CheckCircle
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffInHours = Math.floor((now - announcementDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return announcementDate.toLocaleDateString();
  };

  const isNew = (date) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffInHours = (now - announcementDate) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter size={16} />
              Filters
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
            <div className="text-sm text-gray-600">
              Showing {filteredAnnouncements.length} announcements
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Audiences</option>
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                  <option value="visitors">Visitors</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <AnnouncementSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement) => {
              const PriorityIcon = priorityIcons[announcement.priority] || Info;
              
              return (
                <div
                  key={announcement._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg border ${priorityColors[announcement.priority]}`}>
                        <PriorityIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {announcement.title}
                          </h2>
                          {isNew(announcement.publishDate || announcement.createdAt) && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              New
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {announcement.author?.firstName} {announcement.author?.lastName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(announcement.publishDate || announcement.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {getTimeAgo(announcement.publishDate || announcement.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[announcement.priority]}`}>
                        {announcement.priority} priority
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {announcement.excerpt || announcement.content}
                    </p>
                  </div>

                  {/* Target Audience */}
                  {announcement.targetAudience && announcement.targetAudience.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-600">For:</span>
                        {announcement.targetAudience.map((audience, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {announcement.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {announcement.likes?.length || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {announcement.comments?.length || 0} comments
                      </span>
                    </div>

                    {announcement.actionUrl && (
                      <Link
                        to={announcement.actionUrl}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {announcement.actionText || 'Learn More'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedPriority !== 'all' || selectedAudience !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No announcements have been posted yet.'}
            </p>
          </div>
        )}

        {/* Admin Actions */}
        {user && (user.role === 'admin' || user.role === 'professor') && (
          <div className="mt-12 text-center">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Bell size={20} />
              Manage Announcements
            </Link>
          </div>
        )}

        {/* Subscription Notice */}
        {!user && (
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <Bell className="mx-auto h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">Stay Updated</h3>
            <p className="text-blue-700 mb-4">
              Sign in to receive personalized announcements and notifications.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;