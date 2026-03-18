const SEVERITY_STYLES = {
  critical: { bg: '#2d1515', border: '#ef4444', badge: '#ef4444', text: 'CRITICAL' },
  warning:  { bg: '#2d2015', border: '#f59e0b', badge: '#f59e0b', text: 'WARNING'  },
  info:     { bg: '#151d2d', border: '#6366f1', badge: '#6366f1', text: 'INFO'     },
};

function ScoreRing({ score }) {
  var color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:64, height:64, borderRadius:'50%',
                    border: '4px solid ' + color,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:20, fontWeight:700, color:color }}>{score}</span>
      </div>
      <div>
        <div style={{ fontSize:14, color:'#9ca3af' }}>Code Quality Score</div>
        <div style={{ fontSize:13, color:'#6b7280', marginTop:2 }}>
          {score >= 80 ? 'Good' : score >= 60 ? 'Needs work' : 'Critical issues found'}
        </div>
      </div>
    </div>
  );
}

function IssueCard({ issue }) {
  var s = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.info;
  return (
    <div style={{ background:s.bg, border:'1px solid '+s.border,
                  borderRadius:8, padding:16, marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <span style={{ background:s.badge, color:'#fff', fontSize:10,
                        padding:'2px 8px', borderRadius:20, fontWeight:700 }}>
          {s.text}
        </span>
        {issue.line && <span style={{ fontSize:12, color:'#6b7280' }}>Line {issue.line}</span>}
        <span style={{ fontSize:14, fontWeight:600, color:'#e2e8f0' }}>{issue.title}</span>
      </div>
      <p style={{ fontSize:13, color:'#9ca3af', marginBottom:8 }}>{issue.description}</p>
      <p style={{ fontSize:13, color:'#6ee7b7' }}>💡 {issue.suggestion}</p>
    </div>
  );
}

export default function ReviewResult({ review }) {
  if (!review || !review.result) return null;
  var r = review.result;
  return (
    <div style={{ marginTop:24 }}>
      <ScoreRing score={r.score} />
      <p style={{ color:'#94a3b8', marginBottom:20, fontSize:14, lineHeight:1.7 }}>{r.summary}</p>
      {r.issues && r.issues.length > 0 && (
        <div>
          <h3 style={{ color:'#e2e8f0', marginBottom:12 }}>Issues ({r.issues.length})</h3>
          {r.issues.map(function(issue, i) { return <IssueCard key={i} issue={issue} />; })}
        </div>
      )}
      {r.positives && r.positives.length > 0 && (
        <div style={{ marginTop:16, padding:14, background:'#0d1f14',
                      border:'1px solid #34d399', borderRadius:8 }}>
          <h4 style={{ color:'#34d399', marginBottom:8 }}>✓ What looks good</h4>
          {r.positives.map(function(p, i) {
            return <p key={i} style={{ fontSize:13, color:'#6ee7b7', marginBottom:4 }}>• {p}</p>;
          })}
        </div>
      )}
    </div>
  );
}
