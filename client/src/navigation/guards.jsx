// Route guards: one file for auth, public, privileged, and admin checks.
// Route guards: central place for auth and role checks.
// It keeps login-only, manager, and admin access rules together.
// Use this file to see who can open which routes.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
};

export const PrivilegedRoute = () => {
  const { user } = useAuth();

  if (!user?.isAdmin && !user?.isManager) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
};