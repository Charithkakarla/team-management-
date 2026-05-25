// Auth API: login and registration requests.
// It wraps the backend auth endpoints in simple functions.
// Use this file for sign-in and sign-up network calls.
import { api } from './api';

export const login = (payload) => api.post('/auth/login', payload);
export const register = (payload) => api.post('/auth/register', payload);
export const getCurrent = () => api.get('/auth/me');
