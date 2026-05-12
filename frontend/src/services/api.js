/**
 * API Service
 * Axios instance with base configuration and interceptors
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://police-grievance-portal-1bfk.onrender.com/api'
});

export default api;

// Request interceptor - attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


