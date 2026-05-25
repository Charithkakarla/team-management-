import { api } from './api';

export const fetchPermissions = (userId, teamId) => api.get(`/permissions/${userId}/${teamId}`);
