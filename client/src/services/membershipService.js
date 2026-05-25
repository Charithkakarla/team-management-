import { api } from './api';

export const addUserToTeam = (payload) => api.post('/memberships/add-user', payload);
export const removeUserFromTeam = (payload) => api.post('/memberships/remove-user', payload);
export const assignRole = (payload) => api.post('/memberships/assign-role', payload);
export const updateRole = (payload) => api.put('/memberships/update-role', payload);
