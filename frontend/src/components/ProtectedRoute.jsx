import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, admin = false }) {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();
  const location = useLocation();

  const authed = admin ? isAdminAuthenticated() : isAuthenticated();
  const redirectTo = admin ? '/admin/login' : '/login';

  if (!authed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}
