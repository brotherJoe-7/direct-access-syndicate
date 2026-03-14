import axios from 'axios';

import { mockStats, mockParentProfile, mockChildren, mockTeacherData } from './mockDemoData';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds for AI and large uploads
});

// Mock Interceptor for Demo Mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token');
    
    if (isDemo) {
      const url = error.config.url;
      // Handle Admin & General Dashboard
      if (url.includes('/dashboard')) {
        return Promise.resolve({ data: mockStats });
      }
      // Handle Parent Profile
      if (url.includes('/parents/profile')) {
        return Promise.resolve({ data: mockParentProfile });
      }
      // Handle Staff/Teacher Profile
      if (url.includes('/staff/profile') || url.includes('/parents/profile')) {
        return Promise.resolve({ data: mockTeacherData || mockParentProfile });
      }
      // Handle Children
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
