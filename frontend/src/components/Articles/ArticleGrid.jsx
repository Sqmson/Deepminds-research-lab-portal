import React, { useEffect, useState, useCallback } from 'react';
import ArticleCard from './ArticleCard';
const API_BASE_URL1 = import.meta.env.VITE_API_BASE_URL;

const ArticleList = ({ selectedCategory, searchTerm }) => {
  const [loading, setLoading] = useState(false); // ADD THIS
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // articles per page

  const fetchArticles = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL1}/articles?...`);
      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prev => [...prev, ...data]);
        }

        setHasMore(data.length >= 6);
      } catch (jsonErr) {
        console.error('JSON parse error:', jsonErr, 'Response text:', text);
      }
    } catch (networkErr) {
      console.error('Network error:', networkErr);
    } finally {
      setLoading(false);
    }
    console.log("Fetching:", `/articles?category=${(selectedCategory || 'all').toLowerCase()}&page=${page}&limit=6`);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles();
  }, [selectedCategory]);


  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  // Fetch next page when page state changes (except first load)
  useEffect(() => {
    if (page === 1) return;
    fetchArticles(page);
  }, [page, fetchArticles]);

  // Client-side filtering on search term
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
