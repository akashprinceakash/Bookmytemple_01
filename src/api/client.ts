import axios from 'axios';
import { redirectToLogin } from '../utils/navigation';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      // window.location.href = "/login";
            redirectToLogin();

    }
    return Promise.reject(error);
  }
);