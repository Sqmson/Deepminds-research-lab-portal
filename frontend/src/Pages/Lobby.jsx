import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, 
  Users, 
  Video, 
  FileText,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Bell,
  Eye,
  Heart,
  Download
} from 'lucide-react';
import { dashboardAPI, announcementsAPI } from '../services/api';
import { StatsSkeleton, AnnouncementSkeleton, CardSkeleton } from '../components/UI/SkeletonLoader';
import { Link } from 'react-router-dom';

const Lobby = () => {
  // Fetch dashboard overview data
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardAPI.getOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch recent announcements
  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ['recent-announcements'],
    queryFn: () => announcementsAPI.getRecentAnnouncements({ limit: 5 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const statsData = overview?.success ? [
    {
      title: 'Total Members',
      value: overview.data.userStats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Publications',
      value: overview.data.publications?.length || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Videos',
      value: overview.data.videoStats?.overview?.totalVideos || 0,
      icon: Video,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Articles',
      value: overview.data.articles?.length || 0,
      icon: BookOpen,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            DeepMinds Research Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advancing the frontiers of Machine Learning and Artificial Intelligence at 
            Mbarara University of Science and Technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/publications"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <FileText size={20} />
              Explore Research
            </Link>
            <Link
              to="/members"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <Users size={20} />
              Meet Our Team
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lab Overview</h2>
          {overviewLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Latest Publications',
                description: 'Explore our recent research publications and findings',
                icon: FileText,
                color: 'bg-blue-500',
                link: '/publications',
                count: overview?.data?.publications?.length || 0
              },
              {
                title: 'Research Videos',
                description: 'Watch presentations and research discussions',
                icon: Video,
                color: 'bg-purple-500',
                link: '/videos',
                count: overview?.data?.videoStats?.overview?.totalVideos || 0
              },
              {
                title: 'Lab Members',
                description: 'Meet our faculty, students, and researchers',
                icon: Users,
                color: 'bg-green-500',
                link: '/members',
                count: overview?.data?.userStats?.overview?.totalUsers || 0
              }
            ].map((item) => (
              <div key={item.title}>
                <Link
                  to={item.link}
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${item.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                      {item.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                    Explore <ArrowRight size={16} className="ml-1" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell size={24} />
              Recent Announcements
            </h2>
            <Link
              to="/announcements"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {announcementsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <AnnouncementSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {announcements?.data?.data?.slice(0, 3).map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {announcement.excerpt || announcement.content}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {announcement.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} />
                        {announcement.likes?.length || 0}
                      </span>
                    </div>
                    <span>
                      {new Date(announcement.publishDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Research</h2>
          {overviewLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overview?.data?.publications?.slice(0, 3).map((publication) => (
                <div
                  key={publication._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {publication.publicationType}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {publication.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {publication.abstract}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{publication.year}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {publication.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={14} />
                        {publication.downloads || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
