import { api } from './api';

export const fetchUsers = () => api.get('/users');
export const createUser = (payload) => api.post('/users', payload);
