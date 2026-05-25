// Permission API: loads effective permissions for a user and team.
// It asks the backend what a user can do in a team.
// Use this file for permission lookup screens.
import { api } from './api';

export const fetchPermissions = (userId, teamId) => api.get(`/permissions/${userId}/${teamId}`);
