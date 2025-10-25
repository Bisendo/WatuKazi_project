// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken') || 
                    sessionStorage.getItem('authToken') ||
                    localStorage.getItem('token') ||
                    sessionStorage.getItem('token');
      
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token, rememberMe = false) => {
    // Store token based on remember me preference
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    // Clear all storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};