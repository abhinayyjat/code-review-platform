import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useReviews() {
  var [reviews,  setReviews]  = useState([]);
  var [loading,  setLoading]  = useState(true);
  var [error,    setError]    = useState('');
  var [page,     setPage]     = useState(0);
  var [hasMore,  setHasMore]  = useState(true);
  var LIMIT = 10;

  var fetchReviews = useCallback(async function(pageNum) {
    try {
      setLoading(true);
      var res = await api.get('/api/reviews', {
        params: { limit: LIMIT, skip: pageNum * LIMIT },
      });
      if (pageNum === 0) {
        setReviews(res.data);
      } else {
        setReviews(function(prev) { return prev.concat(res.data); });
      }
      setHasMore(res.data.length === LIMIT);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(function() { fetchReviews(0); }, [fetchReviews]);

  function loadMore() {
    var next = page + 1;
    setPage(next);
    fetchReviews(next);
  }

  return { reviews: reviews, loading: loading, error: error, hasMore: hasMore, loadMore: loadMore };
}
