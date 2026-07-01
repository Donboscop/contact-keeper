import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Read cached login status on boot
    const cachedToken = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');

    if (cachedToken && cachedUser) {
      try {
        setToken(cachedToken);
        setUser(JSON.parse(cachedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to parse cached user data:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Register new account
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: jwtToken, user: userData } = res.data;
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Authenticate user session
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = res.data;
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Destroy session
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Change security password
  const changePassword = async (oldPassword, newPassword) => {
    setError(null);
    try {
      const res = await api.put('/auth/change-password', { oldPassword, newPassword });
      return { success: true, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to change password';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        changePassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
