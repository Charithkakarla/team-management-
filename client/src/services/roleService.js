import { api } from './api';

export const fetchRoles = () => api.get('/roles');
export const createRole = (payload) => api.post('/roles', payload);
export const updateRolePermissions = (id, permissions) => api.put(`/roles/${id}/permissions`, { permissions });
