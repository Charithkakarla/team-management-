import { api } from './api';

export const fetchTeams = () => api.get('/teams');
export const createTeam = (payload) => api.post('/teams', payload);
