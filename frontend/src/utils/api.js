import axios from 'axios';

import { mockStats, mockParentProfile, mockChildren } from './mockDemoData';

const api = axios.create({
  baseURL: '/api',
});

// Mock Interceptor for Demo Mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token');
    
    if (isDemo) {
      const url = error.config.url;
      if (url.includes('/dashboard')) {
        return Promise.resolve({ data: mockStats });
      }
      if (url.includes('/parents/profile')) {
        return Promise.resolve({ data: mockParentProfile });
      }
      if (url.includes('/parents/children')) {
        return Promise.resolve({ data: mockChildren });
      }
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
