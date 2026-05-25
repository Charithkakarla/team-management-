import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UsersPage } from '../pages/UsersPage';
import { TeamsPage } from '../pages/TeamsPage';
import { RolesPage } from '../pages/RolesPage';
import { PermissionsPage } from '../pages/PermissionsPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
