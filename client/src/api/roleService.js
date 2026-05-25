// Role API: fetches and updates role definitions.
// It supports listing roles, creating roles, and editing permissions.
// Use this file for admin role management requests.
import { api } from './api';

export const fetchRoles = () => api.get('/roles');
export const createRole = (payload) => api.post('/roles', payload);
export const updateRolePermissions = (id, permissions) => api.put(`/roles/${id}/permissions`, { permissions });
