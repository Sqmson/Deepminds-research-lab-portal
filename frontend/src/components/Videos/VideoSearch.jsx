import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';

const VideoSearch = ({
  onSearch,
  onFilterChange,
  onSortChange,
  onLayoutChange,
  filters = {},
  currentLayout = 'grid',
  availableCategories = [],
  availableResearchAreas = [],
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: 'All',
    researchArea: 'All',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    ...filters
  });
  
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (sortBy, sortOrder) => {
    const newFilters = { ...localFilters, sortBy, sortOrder };
    setLocalFilters(newFilters);
    onSortChange?.(sortBy, sortOrder);
  };

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'All',
      researchArea: 'All',
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const hasActiveFilters = localFilters.category !== 'All' || 
                          localFilters.researchArea !== 'All' ||
                          localFilters.sortBy !== 'publishedAt' ||
                          localFilters.sortOrder !== 'desc';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search videos by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                {[
                  localFilters.category !== 'All' ? 1 : 0,
                  localFilters.researchArea !== 'All' ? 1 : 0,
                  localFilters.sortBy !== 'publishedAt' || localFilters.sortOrder !== 'desc' ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {/* Layout Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onLayoutChange?.('grid')}
              className={`p-3 ${
                currentLayout === 'grid'
                  ? 'bg-blue-50 text-blue-600 border-r border-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-r border-gray-300'
              }`}
              aria-label="Grid layout"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onLayoutChange?.('list')}
              className={`p-3 ${
                currentLayout === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              aria-label="List layout"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="All">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Research Area Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Area
                </label>
                <select
                  value={localFilters.researchArea}
                  onChange={(e) => handleFilterChange('researchArea', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="All">All Areas</option>
                  {availableResearchAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="publishedAt">Date Published</option>
                  <option value="viewCount">View Count</option>
                  <option value="title">Title</option>
                  <option value="localViews">Local Views</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSortChange(localFilters.sortBy, 'desc')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                      localFilters.sortOrder === 'desc'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SortDesc className="h-4 w-4" />
                    Desc
                  </button>
                  <button
                    onClick={() => handleSortChange(localFilters.sortBy, 'asc')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                      localFilters.sortOrder === 'asc'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <SortAsc className="h-4 w-4" />
                    Asc
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Search/Filter Summary */}
        {(searchTerm || hasActiveFilters) && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            {localFilters.category !== 'All' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Category: {localFilters.category}
              </span>
            )}
            {localFilters.researchArea !== 'All' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Area: {localFilters.researchArea}
              </span>
            )}
            {(localFilters.sortBy !== 'publishedAt' || localFilters.sortOrder !== 'desc') && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Sort: {localFilters.sortBy} ({localFilters.sortOrder})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSearch;