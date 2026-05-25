// User API: creates and lists users.
// It handles the user directory endpoints.
// Use this file when the app needs to list or create users.
import { api } from './api';

export const fetchUsers = () => api.get('/users');
export const createUser = (payload) => api.post('/users', payload);
