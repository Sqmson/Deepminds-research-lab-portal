import { useState, useEffect } from 'react';

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 6; // Number of articles per page

  const fetchArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const query = new URLSearchParams({
        category: category.toLowerCase() || 'all',
        search: searchTerm || '',
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`http://localhost:5000/articles?${query.toString()}`);
      const text = await res.text();

      try {
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        if (page === 1) {
          setArticles(data);
        } else {
          setArticles(prev => [...prev, ...data]);
        }

        setHasMore(data.length >= limit);
      } catch (jsonErr) {
        console.error('JSON parse error:', jsonErr, 'Response text:', text);
      }
    } catch (networkErr) {
      console.error('Network error:', networkErr);
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch fresh data when filters change
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [category, searchTerm]);

  // Fetch on page change
  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return {
    articles,
    category,
    setCategory,
    searchTerm,
    setSearchTerm,
    loading,
  };
};

export default useArticles;
