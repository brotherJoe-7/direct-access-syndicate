import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    if (!roles.includes(role)) return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
