// API client: shared Axios setup for all frontend requests.
// It adds the base URL and attaches the JWT token.
// Use this file to see how every frontend request is configured.
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rbac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
