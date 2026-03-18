import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';
import api from '../services/api';

export default function TeamsPage() {
  var [teams,    setTeams]    = useState([]);
  var [newName,  setNewName]  = useState('');
  var [loading,  setLoading]  = useState(true);
  var [creating, setCreating] = useState(false);
  var navigate = useNavigate();

  useEffect(function() {
    api.get('/api/teams')
      .then(function(res) { setTeams(res.data); })
      .finally(function() { setLoading(false); });
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      var res = await api.post('/api/teams', { name: newName });
      setTeams(function(prev) { return [res.data].concat(prev); });
      setNewName('');
    } finally { setCreating(false); }
  }

  return (
    <PageLayout>
      <h1 style={{ fontSize:24, fontWeight:700, color:'#e2e8f0', marginBottom:24 }}>👥 Teams</h1>

      {/* Create team */}
      <div style={{ display:'flex', gap:12, marginBottom:32 }}>
        <input value={newName} onChange={function(e) { setNewName(e.target.value); }}
          placeholder='Team name...'
          style={{ flex:1, background:'#0d1320', border:'1px solid #1a2540',
                   color:'#e2e8f0', borderRadius:6, padding:'8px 12px', fontSize:14 }} />
        <button onClick={handleCreate} disabled={creating || !newName.trim()}
          style={{ background:'#4F46E5', color:'#fff', border:'none',
                   borderRadius:6, padding:'8px 20px', cursor:'pointer', fontWeight:600 }}>
          {creating ? 'Creating...' : '+ Create Team'}
        </button>
      </div>

      {loading && <p style={{ color:'#6b7280' }}>Loading teams...</p>}

      {/* Team list */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {teams.map(function(team) {
          return (
            <div key={team.id}
              onClick={function() { navigate('/teams/' + team.id); }}
              style={{ background:'#0d1320', border:'1px solid #1a2540',
                       borderRadius:10, padding:20, cursor:'pointer' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = '#4F46E5'; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#1a2540'; }}
            >
              <h3 style={{ color:'#e2e8f0', marginBottom:8 }}>{team.name}</h3>
              <p style={{ color:'#6b7280', fontSize:13 }}>
                {team.members.length} member{team.members.length !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>

      {!loading && teams.length === 0 && (
        <p style={{ color:'#6b7280', textAlign:'center', marginTop:60 }}>
          No teams yet. Create one above.
        </p>
      )}
    </PageLayout>
  );
}
