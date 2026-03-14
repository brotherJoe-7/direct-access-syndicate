import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);

  useEffect(() => {
    // Initialization is synchronous in useState
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      saveSession(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const requestOTP = async (phone) => {
    try {
      const { data } = await api.post('/auth/request-otp', { phone });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to send OTP';
    }
  };

  const verifyOTP = async (phone, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { phone, otp });
      saveSession(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Invalid OTP code';
    }
  };

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.role);
    setUser(data.user);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, requestOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
