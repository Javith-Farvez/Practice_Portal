import axios from 'axios';

/**
 * Resolves and normalizes the API base URL.
 * Automatically handles:
 * - Production domain without /api (e.g. 'https://practice-portal-kmri.onrender.com' -> 'https://practice-portal-kmri.onrender.com/api')
 * - Production domain with /api (e.g. 'https://practice-portal-kmri.onrender.com/api')
 * - Trailing slashes (e.g. 'https://practice-portal-kmri.onrender.com/')
 * - Fallbacks: Production -> 'https://practice-portal-kmri.onrender.com/api', Local dev -> 'http://localhost:5001/api'
 */
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD;

  let url = (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '')
    ? envUrl.trim()
    : (isProd ? 'https://practice-portal-kmri.onrender.com' : 'http://localhost:5001/api');

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure /api suffix exists to match backend Express route mounting
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Differentiate between Portal JWT expiration and GitHub OAuth sub-service token expiration
      const isGitHubEndpoint = error.config?.url?.includes('/github');
      const isReconnectRequired = error.response?.data?.reconnect_required;
      const isAuthEndpoint =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      // Only clear portal session and redirect to /login if the PORTAL's JWT expired
      if (!isAuthEndpoint && !isGitHubEndpoint && !isReconnectRequired) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
