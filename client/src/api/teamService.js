// Team API: creates and lists teams.
// It wraps the backend endpoints for team management.
// Use this file when the UI needs team data.
import { api } from './api';

export const fetchTeams = () => api.get('/teams');
export const createTeam = (payload) => api.post('/teams', payload);
