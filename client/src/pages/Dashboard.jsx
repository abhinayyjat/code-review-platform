import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import PageLayout from '../components/Layout/PageLayout';
import ErrorBoundary from '../components/UI/ErrorBoundary';

export default function Dashboard() {
  var user     = useAuthStore(function(s) { return s.user; });
  var logout   = useAuthStore(function(s) { return s.logout; });
  var navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <ErrorBoundary>
      <PageLayout>
        <h1 style={{ color:'#e2e8f0', fontSize:28, fontWeight:700 }}>
          Welcome, {user ? user.username : '...'}! 👋
        </h1>
        <p style={{ color:'#6b7280', marginTop:8 }}></p>
        <Link to="/review" style={{ color:'#818CF8', marginTop:16, display:'block' }}>
          → Go to Code Review
        </Link>
        <Link to="/history" style={{ color:'#818CF8', display:'block', marginTop:8 }}>
          → View Review History
        </Link>
        <button onClick={handleLogout}
          style={{ marginTop:32, background:'#374151', color:'#fff',
                   border:'none', padding:'10px 20px', borderRadius:6, cursor:'pointer' }}>
          Logout
        </button>
      </PageLayout>
    </ErrorBoundary>
  );
}