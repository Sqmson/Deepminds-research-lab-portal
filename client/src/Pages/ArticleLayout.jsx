import React from 'react';
import ArticleSearch from '../components/Articles/ArticleSearch';
import ArticleFilter from '../components/Articles/ArticleFilter';
import ArticleGrid from '../components/Articles/ArticleGrid';
import useArticles from '../hooks/useArticle';

const ArticleLayout = () => {
  const {
    articles,
    filteredArticles,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useArticles();

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e1e4e8', padding: '24px 0' }}>

      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        <ArticleSearch query={searchQuery} setQuery={setSearchQuery} />
        <ArticleFilter selected={selectedCategory} setSelected={setSelectedCategory} />
        <ArticleGrid articles={filteredArticles} />
      </div>
    </div>
  );
};

export default ArticleLayout;
