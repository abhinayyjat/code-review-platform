import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000,
});

// Attach JWT to every request automatically
api.interceptors.request.use(function(config) {
  var token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  function(response) { return response; },
  function(error) {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
