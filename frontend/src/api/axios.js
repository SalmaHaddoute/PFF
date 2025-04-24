// api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

// Intercepteur pour les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 419) {
      window.location.reload(); // Régénère le CSRF token si expiré
    }
    return Promise.reject(error);
  }
);

export default api;