
// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children }) {
  var token = useAuthStore(function(s) { return s.token; });
  return token ? children : <Navigate to='/login' replace />;
}
