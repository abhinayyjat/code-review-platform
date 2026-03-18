import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewResult  from '../components/ReviewPanel/ReviewResult';
import api           from '../services/api';
import PageLayout    from '../components/Layout/PageLayout';
import ErrorBoundary from '../components/UI/ErrorBoundary';

export default function ReviewDetailPage() {
  var { id }    = useParams();
  var navigate  = useNavigate();
  var [review,  setReview]  = useState(null);
  var [loading, setLoading] = useState(true);
  var [error,   setError]   = useState('');

  useEffect(function() {
    api.get('/api/reviews/' + id)
      .then(function(res)  { setReview(res.data); })
      .catch(function()    { setError('Review not found'); })
      .finally(function()  { setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <ErrorBoundary>
        <PageLayout>
          <p style={{ color:'#6b7280' }}>Loading...</p>
        </PageLayout>
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        <PageLayout>
          <p style={{ color:'#ef4444' }}>{error}</p>
        </PageLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout>
        <button onClick={function() { navigate('/history'); }}
          style={{ background:'transparent', border:'1px solid #1a2540',
                   color:'#6b7280', borderRadius:6, padding:'6px 14px',
                   cursor:'pointer', marginBottom:24 }}>
          ← Back to History
        </button>
        <h1 style={{ fontSize:22, fontWeight:700, marginBottom:4, color:'#e2e8f0' }}>
          Review Detail
        </h1>
        <p style={{ color:'#6b7280', marginBottom:24, fontSize:13 }}>
          {review.language.toUpperCase()} • {new Date(review.createdAt).toLocaleString()}
        </p>
        <ReviewResult review={review} />
      </PageLayout>
    </ErrorBoundary>
  );
}