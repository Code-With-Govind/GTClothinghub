import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.user);
        } catch (err) {
          console.warn('Auth token expired or invalid');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.user);
    return res.user;
  };

  const sendEmailOtp = async (email) => {
    return await api.post('/auth/send-email-otp', { email });
  };

  const verifyEmailOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-email-otp', { email, otp });
    if (res.user) {
      setUser((prev) => ({ ...prev, ...res.user }));
    }
    return res;
  };

  const sendPhoneOtp = async (phone) => {
    return await api.post('/auth/send-phone-otp', { phone });
  };

  const verifyPhoneOtp = async (phone, otp) => {
    const res = await api.post('/auth/verify-phone-otp', { phone, otp });
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        sendEmailOtp,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

