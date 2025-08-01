import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
const API_BASE_URL1 = import.meta.env.VITE_API_BASE_URL;

const ArticleList = ({ selectedCategory, searchTerm }) => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchArticles = async (pageToFetch) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const query = new URLSearchParams({
        category: (selectedCategory || 'all').toLowerCase(),
        page: pageToFetch.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE_URL1}/articles?${query}`);
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setArticles(prev => (pageToFetch === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === limit);
      } catch (err) {
        console.error('JSON parse error:', err);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch/reset when category/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles(1); // Reset to page 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Fetch next pages only when page > 1
  useEffect(() => {
    if (page > 1) fetchArticles(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Filtered client-side search (optional)
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div>
      {filteredArticles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
      {!hasMore && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '1rem' }}>
          No more articles.
        </p>
      )}
    </div>
  );
};

export default ArticleList;
