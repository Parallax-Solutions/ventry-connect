import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

const redirectToLogin = () => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const loginUrl = new URL('login', `${window.location.origin}${normalizedBaseUrl}`);
  window.history.replaceState(null, '', `${loginUrl.pathname}${loginUrl.search}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

// Request interceptor: inject Authorization header
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (token) promise.resolve(token);
    else promise.reject(error);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes('/auth/login')
      || originalRequest?.url?.includes('/auth/register');

    if (error.response?.status !== 401 || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      useAuthStore.getState().logout();
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        useAuthStore.getState().logout();
        redirectToLogin();
        return Promise.reject(error);
      }

      const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
