import { useState, useEffect, useRef } from 'react';
import CodeEditor       from '../components/Editor/CodeEditor';
import LanguageSelector from '../components/Editor/LanguageSelector';
import ReviewResult     from '../components/ReviewPanel/ReviewResult';
import api              from '../services/api';
import { getSocket }    from '../hooks/useSocket';
import PageLayout       from '../components/Layout/PageLayout';
import ErrorBoundary    from '../components/UI/ErrorBoundary';

export default function ReviewPage() {
  var [language,   setLanguage]   = useState('javascript');
  var [code,       setCode]       = useState('');
  var [review,     setReview]     = useState(null);
  var [loading,    setLoading]    = useState(false);
  var [streamText, setStreamText] = useState('');
  var [error,      setError]      = useState('');
  var socketRef = useRef(null);

  useEffect(function() {
    socketRef.current = getSocket();
    var socket = socketRef.current;

    socket.on('review:start', function() { setStreamText(''); });
    socket.on('review:chunk', function(data) {
      setStreamText(function(prev) { return prev + data.chunk; });
    });
    socket.on('review:done', function(data) {
      setReview(data.review);
      setStreamText('');
      setLoading(false);
    });
    socket.on('review:error', function(data) {
      setError(data.message);
      setLoading(false);
    });

    return function() {
      socket.off('review:start');
      socket.off('review:chunk');
      socket.off('review:done');
      socket.off('review:error');
    };
  }, []);

async function handleSubmit() {
  if (!code.trim()) return;
  setLoading(true);
  setError('');
  setReview(null);
  setStreamText('');
  try {
    var res = await api.post('/api/reviews', {
      code:     code,
      language: language,
      socketId: socketRef.current ? socketRef.current.id : null,
    });
    // Use HTTP response directly — don't wait for socket event
    // Socket streaming is a bonus if it works, not required for result
    setReview(res.data);
    setStreamText('');
    setLoading(false);
  } catch (err) {
    if (err.response && err.response.status === 429) {
      var retryMins = Math.ceil(err.response.data.retryAfter / 60);
      setError('Review limit reached. Try again in ' + retryMins + ' minutes.');
    } else {
      setError(err.response ? err.response.data.error : 'Something went wrong');
    }
    setLoading(false);
  }
}

  return (
    <ErrorBoundary>
      <PageLayout>
        <h1 style={{ fontSize:24, fontWeight:700, marginBottom:4, color:'#e2e8f0' }}>
          🔍 Code Review
        </h1>
        <div style={{ display:'flex', gap:12, marginBottom:16, alignItems:'center' }}>
          <LanguageSelector value={language} onChange={function(l) {
            setLanguage(l); setCode('');
          }} />
          <button onClick={handleSubmit} disabled={loading || !code.trim()}
            style={{ background: loading ? '#374151' : '#4F46E5', color:'#fff',
                     border:'none', borderRadius:6, padding:'8px 24px',
                     fontSize:14, fontWeight:600,
                     cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
        </div>
        <CodeEditor language={language} value={code} onChange={setCode} />
        {error && <p style={{ color:'#ef4444', marginTop:16 }}>{error}</p>}
        {streamText && (
          <div style={{ marginTop:24, padding:20, background:'#0d1320',
                        border:'1px solid #1a2540', borderRadius:8,
                        fontFamily:'monospace', fontSize:13, color:'#7dd3fc',
                        whiteSpace:'pre-wrap', maxHeight:300, overflowY:'auto' }}>
            {streamText}
            <span style={{ animation:'pulse 1s infinite' }}>▊</span>
          </div>
        )}
        <ReviewResult review={review} />
      </PageLayout>
    </ErrorBoundary>
  );
}