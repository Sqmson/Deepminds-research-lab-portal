import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Users,
  BookOpen,
  Award,
  FileText,
  ChevronDown,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { publicationsAPI } from '../services/api';
import { CardSkeleton } from '../components/UI/SkeletonLoader';

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch publications
  const { data: publications, isLoading: publicationsLoading } = useQuery({
    queryKey: ['publications', { sortBy, sortOrder }],
    queryFn: () => publicationsAPI.getPublications({ 
      limit: 100,
      sortBy,
      sortOrder 
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter publications
  const filteredPublications = publications?.data?.data?.filter(pub => {
    const matchesSearch = searchTerm === '' || 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors?.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pub.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || pub.publicationType === selectedType;
    const matchesYear = selectedYear === 'all' || pub.year?.toString() === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  }) || [];

  // Get unique types and years for filters
  const types = publications?.data?.data ? [...new Set(publications.data.data.map(pub => pub.publicationType).filter(Boolean))] : [];
  const years = publications?.data?.data ? [...new Set(publications.data.data.map(pub => pub.year).filter(Boolean))].sort((a, b) => b - a) : [];

  // Publication type colors
  const typeColors = {
    'journal': 'bg-blue-100 text-blue-800',
    'conference': 'bg-green-100 text-green-800',
    'workshop': 'bg-yellow-100 text-yellow-800',
    'book': 'bg-purple-100 text-purple-800',
    'thesis': 'bg-red-100 text-red-800',
    'preprint': 'bg-gray-100 text-gray-800'
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search publications by title, abstract, authors, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter size={16} />
              Filters & Sorting
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
            <div className="text-sm text-gray-600">
              Showing {filteredPublications.length} of {publications?.data?.data?.length || 0} publications
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="citations">Citations</option>
                  <option value="views">Views</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center gap-2"
                >
                  {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Publications Grid */}
        {publicationsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPublications.map((publication) => (
              <div key={publication._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[publication.publicationType] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {publication.publicationType}
                      </span>
                      {publication.year && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar size={14} />
                          {publication.year}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {publication.title}
                    </h2>
                  </div>
                </div>

                {/* Authors */}
                {publication.authors && publication.authors.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={14} />
                      <span>{publication.authors.join(', ')}</span>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {publication.venue && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={14} />
                      <span className="italic">{publication.venue}</span>
                    </div>
                  </div>
                )}

                {/* Abstract */}
                {publication.abstract && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {publication.abstract}
                    </p>
                  </div>
                )}

                {/* Keywords */}
                {publication.keywords && publication.keywords.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {publication.keywords.slice(0, 5).map((keyword, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                      {publication.keywords.length > 5 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{publication.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {publication.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={14} />
                      {publication.downloads || 0} downloads
                    </span>
                    {publication.citations && (
                      <span className="flex items-center gap-1">
                        <Award size={14} />
                        {publication.citations} citations
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {publication.pdfUrl && (
                      <a
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FileText size={14} />
                        PDF
                      </a>
                    )}
                    {publication.doi && (
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <ExternalLink size={14} />
                        DOI
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!publicationsLoading && filteredPublications.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all' || selectedYear !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No publications have been added yet.'}
            </p>
          </div>
        )}

        {/* Statistics */}
        {publications?.data?.data && publications.data.data.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold text-center mb-8">Publication Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {publications.data.data.length}
                </div>
                <div className="text-blue-100">Total Publications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {publications.data.data.reduce((sum, pub) => sum + (pub.citations || 0), 0)}
                </div>
                <div className="text-blue-100">Total Citations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {publications.data.data.reduce((sum, pub) => sum + (pub.views || 0), 0)}
                </div>
                <div className="text-blue-100">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {Math.max(...publications.data.data.map(pub => pub.year || 0)) - Math.min(...publications.data.data.map(pub => pub.year || 9999)) + 1}
                </div>
                <div className="text-blue-100">Years Active</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;