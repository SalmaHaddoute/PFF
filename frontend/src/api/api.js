import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Essential for CSRF cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 419) { // CSRF token mismatch
      window.location.reload(); // Refresh to get new token
    }
    return Promise.reject(error);
  }
);

export default api;