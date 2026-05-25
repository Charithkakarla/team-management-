// Route tree: connects public, protected, privileged, and admin pages.
// It decides which page renders for each URL.
// Use this file to understand the app navigation flow.
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shells/DashboardLayout';
import { LoginPage } from '../views/LoginPage';
import { DashboardPage } from '../views/DashboardPage';
import { UsersPage } from '../views/UsersPage';
import { TeamsPage } from '../views/TeamsPage';
import { RolesPage } from '../views/RolesPage';
import { PermissionsPage } from '../views/PermissionsPage';
import { TasksPage } from '../views/TasksPage';
import { AdminRoute, PrivilegedRoute, ProtectedRoute, PublicRoute } from './guards';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to={user?.isAdmin || user?.isManager ? '/dashboard' : '/tasks'} replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route element={<PrivilegedRoute />}>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        </Route>
        <Route element={<AdminRoute />}>
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to={user?.isAdmin || user?.isManager ? '/dashboard' : '/tasks'} replace />} />
  </Routes>
  );
};
