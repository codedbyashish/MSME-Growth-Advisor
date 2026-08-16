import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Restore authenticated user on app startup or token change
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setToken(storedToken);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Session expired or invalid token:', error.message);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken('');
        }
      } else {
        setUser(null);
        setToken('');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const jwtToken = data.token;
    const userData = data.user || {
      id: data.id,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
    };

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  // Register handler
  const register = async (userDataInput) => {
    const data = await registerUser(userDataInput);
    const jwtToken = data.token;
    const userData = data.user || {
      id: data.id,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
    };

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
