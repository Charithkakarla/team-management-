// API client: shared Axios setup for all frontend requests.
// It adds the base URL and attaches the JWT token.
// Use this file to see how every frontend request is configured.
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rbac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
