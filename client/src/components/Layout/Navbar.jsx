import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  var user     = useAuthStore(function(s) { return s.user; });
  var logout   = useAuthStore(function(s) { return s.logout; });
  var navigate = useNavigate();
  var location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  var links = [
    { to: '/dashboard', label: 'Home'    },
    { to: '/review',    label: 'Review'  },
    { to: '/history',   label: 'History' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/teams', label: 'Teams' },
  ];

  return (
    <nav style={{ background:'#0d1117', borderBottom:'1px solid #1e2535',
                  padding:'0 24px', height:56, display:'flex',
                  alignItems:'center', justifyContent:'space-between',
                  position:'sticky', top:0, zIndex:100 }}>
      {/* Logo */}
      <Link to='/dashboard' style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:20 }}>🔍</span>
        <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:16 }}>CodeReview AI</span>
      </Link>

      {/* Nav links */}
      <div style={{ display:'flex', gap:4 }}>
        {links.map(function(link) {
          var isActive = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to} style={{
              color:           isActive ? '#818CF8' : '#6b7280',
              textDecoration:  'none',
              padding:         '6px 12px',
              borderRadius:    6,
              fontSize:        14,
              fontWeight:      isActive ? 600 : 400,
              background:      isActive ? '#1a1f35' : 'transparent',
            }}>
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* User avatar + logout */}
      {user && (
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt={user.username}
              style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #1e2535' }} />
          )}
          <span style={{ color:'#6b7280', fontSize:13 }}>{user.username}</span>
          <button onClick={handleLogout} style={{
            background:'transparent', border:'1px solid #374151',
            color:'#6b7280', borderRadius:6, padding:'4px 12px',
            fontSize:12, cursor:'pointer'
          }}>Logout</button>
        </div>
      )}
    </nav>
  );
}
