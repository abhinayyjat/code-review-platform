import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import PageLayout from '../components/Layout/PageLayout';
import api from '../services/api';

var COLORS = ['#4F46E5','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6'];

export default function AnalyticsPage() {
  var [stats,   setStats]   = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    api.get('/api/users/stats')
      .then(function(res) { setStats(res.data); })
      .catch(function(err) { console.error(err); })
      .finally(function() { setLoading(false); });
  }, []);

  if (loading) return <PageLayout><p style={{ color:'#6b7280' }}>Loading stats...</p></PageLayout>;
  if (!stats)  return <PageLayout><p style={{ color:'#ef4444' }}>Failed to load stats</p></PageLayout>;

  return (
    <PageLayout>
      <h1 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0', marginBottom:24 }}>📊 Analytics</h1>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:32 }}>
        {[
          { label:'Total Reviews', value: stats.totalReviews },
          { label:'Avg Score',     value: stats.avgScore + '/100' },
        ].map(function(card) {
          return (
            <div key={card.label} style={{ background:'#0d1320', border:'1px solid #1a2540',
                          borderRadius:10, padding:20 }}>
              <p style={{ color:'#6b7280', fontSize:13, marginBottom:4 }}>{card.label}</p>
              <p style={{ color:'#e2e8f0', fontSize:28, fontWeight:700 }}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Reviews per day */}
      <div style={{ background:'#0d1320', border:'1px solid #1a2540', borderRadius:10, padding:20, marginBottom:24 }}>
        <h3 style={{ color:'#e2e8f0', marginBottom:16 }}>Reviews per day (last 30 days)</h3>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart data={stats.dailyData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#1a2540' />
            <XAxis dataKey='date' tick={{ fill:'#6b7280', fontSize:11 }} />
            <YAxis tick={{ fill:'#6b7280', fontSize:11 }} />
            <Tooltip contentStyle={{ background:'#0d1320', border:'1px solid #1a2540', color:'#e2e8f0' }} />
            <Bar dataKey='count' fill='#4F46E5' radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Score trend */}
      <div style={{ background:'#0d1320', border:'1px solid #1a2540', borderRadius:10, padding:20, marginBottom:24 }}>
        <h3 style={{ color:'#e2e8f0', marginBottom:16 }}>Average score trend</h3>
        <ResponsiveContainer width='100%' height={200}>
          <LineChart data={stats.dailyData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#1a2540' />
            <XAxis dataKey='date' tick={{ fill:'#6b7280', fontSize:11 }} />
            <YAxis domain={[0,100]} tick={{ fill:'#6b7280', fontSize:11 }} />
            <Tooltip contentStyle={{ background:'#0d1320', border:'1px solid #1a2540', color:'#e2e8f0' }} />
            <Line type='monotone' dataKey='avgScore' stroke='#10b981' strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Language breakdown */}
      {stats.languageData.length > 0 && (
        <div style={{ background:'#0d1320', border:'1px solid #1a2540', borderRadius:10, padding:20 }}>
          <h3 style={{ color:'#e2e8f0', marginBottom:16 }}>Language breakdown</h3>
          <ResponsiveContainer width='100%' height={200}>
            <PieChart>
              <Pie data={stats.languageData} dataKey='value' nameKey='name'
                   cx='50%' cy='50%' outerRadius={80} label>
                {stats.languageData.map(function(_, i) {
                  return <Cell key={i} fill={COLORS[i % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip contentStyle={{ background:'#0d1320', border:'1px solid #1a2540', color:'#e2e8f0' }} />
              <Legend wrapperStyle={{ color:'#6b7280' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageLayout>
  );
}
