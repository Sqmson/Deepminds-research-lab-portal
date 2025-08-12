import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  FileText, 
  Users, 
  Video, 
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Eye,
  Download,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { articlesAPI, publicationsAPI, announcementsAPI, usersAPI } from '../services/api';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('article');
  const [editingItem, setEditingItem] = useState(null);

  // Fetch dashboard data
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => articlesAPI.getArticles({ limit: 10 }),
    enabled: user?.role === 'admin' || user?.role === 'professor'
  });

  const { data: publications, isLoading: publicationsLoading } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: () => publicationsAPI.getPublications({ limit: 10 }),
    enabled: user?.role === 'admin' || user?.role === 'professor'
  });

  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => announcementsAPI.getAnnouncements({ limit: 10 }),
    enabled: user?.role === 'admin' || user?.role === 'professor'
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => usersAPI.getUsers({ limit: 10 }),
    enabled: user?.role === 'admin'
  });

  // Mutations for CRUD operations
  const createArticleMutation = useMutation({
    mutationFn: articlesAPI.createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Article created successfully!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create article');
    }
  });

  const createPublicationMutation = useMutation({
    mutationFn: publicationsAPI.createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-publications']);
      toast.success('Publication created successfully!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create publication');
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: announcementsAPI.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-announcements']);
      toast.success('Announcement created successfully!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create announcement');
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: articlesAPI.deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-articles']);
      toast.success('Article deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete article');
    }
  });

  const deletePublicationMutation = useMutation({
    mutationFn: publicationsAPI.deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-publications']);
      toast.success('Publication deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete publication');
    }
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: announcementsAPI.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-announcements']);
      toast.success('Announcement deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete announcement');
    }
  });

  // Check if user has admin access
  if (!user || (user.role !== 'admin' && user.role !== 'professor')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'publications', label: 'Publications', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    ...(user.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleCreate = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowCreateModal(true);
  };

  const handleEdit = (item, type) => {
    setModalType(type);
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      switch (type) {
        case 'article':
          await deleteArticleMutation.mutateAsync(id);
          break;
        case 'publication':
          await deletePublicationMutation.mutateAsync(id);
          break;
        case 'announcement':
          await deleteAnnouncementMutation.mutateAsync(id);
          break;
      }
    } catch {
      // Error handled by mutation
    }
  };

  const renderOverview = () => {
    const stats = [
      {
        title: 'Total Articles',
        value: articles?.data?.pagination?.total || 0,
        icon: FileText,
        color: 'bg-blue-500',
        change: '+12%'
      },
      {
        title: 'Publications',
        value: publications?.data?.pagination?.total || 0,
        icon: FileText,
        color: 'bg-green-500',
        change: '+8%'
      },
      {
        title: 'Announcements',
        value: announcements?.data?.pagination?.total || 0,
        icon: Bell,
        color: 'bg-yellow-500',
        change: '+15%'
      },
      ...(user.role === 'admin' ? [{
        title: 'Total Users',
        value: users?.data?.pagination?.total || 0,
        icon: Users,
        color: 'bg-purple-500',
        change: '+5%'
      }] : [])
    ];

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleCreate('article')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="text-blue-600" size={20} />
              <span className="font-medium">Create Article</span>
            </button>
            <button
              onClick={() => handleCreate('publication')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="text-green-600" size={20} />
              <span className="font-medium">Add Publication</span>
            </button>
            <button
              onClick={() => handleCreate('announcement')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="text-yellow-600" size={20} />
              <span className="font-medium">New Announcement</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {articles?.data?.data?.slice(0, 5).map((article) => (
              <div key={article._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={16} />
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye size={14} />
                  {article.views || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContentList = (data, type, isLoading) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            Manage {type}s
          </h3>
          <button
            onClick={() => handleCreate(type)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Create {type}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.data?.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {item.author || item.authors?.[0] || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(item.createdAt || item.publishDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'published' || item.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status || (item.isPublished ? 'Published' : 'Draft')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item, type)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, type)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'articles':
        return renderContentList(articles, 'article', articlesLoading);
      case 'publications':
        return renderContentList(publications, 'publication', publicationsLoading);
      case 'announcements':
        return renderContentList(announcements, 'announcement', announcementsLoading);
      case 'users':
        return renderContentList(users, 'user', usersLoading);
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.firstName}! Manage your lab's content and settings.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateContentModal
          type={modalType}
          item={editingItem}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => {
            switch (modalType) {
              case 'article':
                createArticleMutation.mutate(data);
                break;
              case 'publication':
                createPublicationMutation.mutate(data);
                break;
              case 'announcement':
                createAnnouncementMutation.mutate(data);
                break;
            }
          }}
          isLoading={
            createArticleMutation.isPending ||
            createPublicationMutation.isPending ||
            createAnnouncementMutation.isPending
          }
        />
      )}
    </div>
  );
};

// Create Content Modal Component
const CreateContentModal = ({ type, item, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(() => {
    if (item) {
      return { ...item };
    }
    
    switch (type) {
      case 'article':
        return {
          title: '',
          content: '',
          excerpt: '',
          tags: [],
          isPublished: false
        };
      case 'publication':
        return {
          title: '',
          abstract: '',
          authors: [],
          venue: '',
          year: new Date().getFullYear(),
          publicationType: 'journal',
          keywords: []
        };
      case 'announcement':
        return {
          title: '',
          content: '',
          priority: 'medium',
          targetAudience: ['all'],
          publishDate: new Date().toISOString().split('T')[0]
        };
      default:
        return {};
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {item ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type-specific fields */}
          {type === 'article' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>
            </>
          )}

          {type === 'publication' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abstract *
                </label>
                <textarea
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={formData.authors?.join(', ') || ''}
                    onChange={(e) => handleArrayChange('authors', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="publicationType"
                    value={formData.publicationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="journal">Journal</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="book">Book</option>
                    <option value="thesis">Thesis</option>
                    <option value="preprint">Preprint</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {type === 'announcement' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {item ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;