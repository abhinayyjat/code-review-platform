import { useNavigate } from 'react-router-dom';
import { useReviews }  from '../hooks/useReviews';
import PageLayout      from '../components/Layout/PageLayout';
import ErrorBoundary   from '../components/UI/ErrorBoundary';

const LANG_COLORS = {
  javascript:'#f7df1e', typescript:'#3178c6', python:'#3776ab',
  java:'#ed8b00', cpp:'#00599c', go:'#00add8',
};

function ReviewCard({ review, onClick }) {
  var score      = review.result ? review.result.score : null;
  var issues     = review.result && review.result.issues ? review.result.issues.length : 0;
  var scoreColor = score === null ? '#6b7280' : score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div onClick={onClick}
      style={{ background:'#0d1320', border:'1px solid #1a2540', borderRadius:10,
               padding:18, cursor:'pointer', transition:'border-color 0.15s' }}
      onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#4F46E5'; }}
      onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#1a2540'; }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:12, fontWeight:700,
                       color: LANG_COLORS[review.language] || '#6b7280',
                       background:'rgba(255,255,255,0.05)',
                       padding:'2px 8px', borderRadius:4 }}>
          {review.language.toUpperCase()}
        </span>
        {score !== null && (
          <span style={{ fontSize:20, fontWeight:700, color: scoreColor }}>{score}</span>
        )}
      </div>
      <p style={{ fontSize:13, color:'#94a3b8', marginBottom:8, lineHeight:1.5 }}>
        {review.result ? review.result.summary.slice(0, 100) + '...' : 'Processing...'}
      </p>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#4b5563' }}>
        <span>{issues} issue{issues !== 1 ? 's' : ''}</span>
        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  var navigate = useNavigate();
  var { reviews, loading, error, hasMore, loadMore } = useReviews();

  if (loading && reviews.length === 0) {
    return (
      <ErrorBoundary>
        <PageLayout>
          <p style={{ color:'#6b7280' }}>Loading reviews...</p>
        </PageLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <PageLayout>
        <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'center', marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0' }}>📋 Review History</h1>
          <button onClick={function() { navigate('/review'); }}
            style={{ background:'#4F46E5', color:'#fff', border:'none',
                     borderRadius:6, padding:'8px 18px', cursor:'pointer' }}>
            + New Review
          </button>
        </div>
        {error && <p style={{ color:'#ef4444' }}>{error}</p>}
        {reviews.length === 0 && !loading && (
          <p style={{ color:'#6b7280', textAlign:'center', marginTop:80 }}>
            No reviews yet. Submit your first code review!
          </p>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {reviews.map(function(review) {
            return (
              <ReviewCard key={review.id} review={review}
                onClick={function() { navigate('/review/' + review.id); }} />
            );
          })}
        </div>
        {hasMore && (
          <button onClick={loadMore} disabled={loading}
            style={{ width:'100%', marginTop:20, background:'transparent',
                     border:'1px solid #1a2540', color:'#6b7280',
                     borderRadius:6, padding:'10px', cursor:'pointer' }}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        )}
      </PageLayout>
    </ErrorBoundary>
  );
}