import axios from 'axios';

// Default to Render production backend if environment variable is not defined
const DEFAULT_BACKEND_URL = 'https://gtclothinghub-backend.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : DEFAULT_BACKEND_URL),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header token if present
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

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

