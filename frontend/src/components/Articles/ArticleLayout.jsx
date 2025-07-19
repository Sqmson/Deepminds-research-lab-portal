import React from 'react';
import ArticleSearch from './ArticleSearch';
import ArticleFilter from './ArticleFilter';
import ArticleGrid from './ArticleGrid';
import useArticles from '../../hooks/useArticle';

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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e1e4e8', padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#24292e' }}>Articles</h1>
          <p style={{ fontSize: '1rem', color: '#586069' }}>Research papers, tutorials, and insights from our lab</p>
        </div>
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
