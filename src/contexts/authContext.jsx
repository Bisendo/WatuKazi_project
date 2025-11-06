import React, { createContext, useState, useContext, useEffect } from 'react';

// Function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored authentication on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for token in localStorage first, then sessionStorage
        const token = localStorage.getItem('authToken') || 
                     sessionStorage.getItem('authToken');

        console.log('🔄 Initializing auth from storage:', { 
          hasToken: !!token
        });

        if (token) {
          // Decode user data from token
          const userData = decodeJWT(token);
          if (userData) {
            setUser(userData);
            setAccessToken(token);
            setIsAuthenticated(true);
            console.log('✅ Restored auth from storage:', { 
              user: userData, 
              hasToken: !!token 
            });
          } else {
            console.log('❌ Invalid token found, clearing storage');
            logout();
          }
        } else {
          console.log('❌ No valid auth data found in storage');
          logout();
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (accessToken, refreshToken, rememberMe = false) => {
    try {
      console.log('🔐 Login called with:', { 
        hasToken: !!accessToken, 
        rememberMe 
      });

      if (!accessToken) {
        throw new Error('No access token provided for authentication');
      }

      // Decode user data from JWT token
      const userData = decodeJWT(accessToken);
      
      if (!userData) {
        throw new Error('Invalid token: Could not decode user data');
      }

      console.log('👤 Decoded user data from token:', userData);

      // Update state
      setUser(userData);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      
      // Store tokens and user data
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', accessToken);
      storage.setItem('refreshToken', refreshToken);
      storage.setItem('userData', JSON.stringify(userData));
      
      // Clear the other storage to avoid conflicts
      const otherStorage = rememberMe ? sessionStorage : localStorage;
      otherStorage.removeItem('authToken');
      otherStorage.removeItem('refreshToken');
      otherStorage.removeItem('userData');
      
      console.log('✅ User logged in successfully:', { 
        user: userData, 
        hasToken: !!accessToken,
        storage: rememberMe ? 'localStorage' : 'sessionStorage'
      });

      return userData;

    } catch (error) {
      console.error('❌ Login error:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    
    // Reset state
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    
    // Clear all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userData');
    
    console.log('✅ User logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    try {
      console.log('🔄 Updating user data:', updatedUserData);
      
      const mergedUser = { ...user, ...updatedUserData };
      setUser(mergedUser);
      
      // Update stored user data
      const storedUser = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const finalUser = { ...currentUser, ...updatedUserData };
        
        if (localStorage.getItem('userData')) {
          localStorage.setItem('userData', JSON.stringify(finalUser));
        } else {
          sessionStorage.setItem('userData', JSON.stringify(finalUser));
        }
        
        console.log('✅ User data updated successfully');
      }
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!accessToken) {
      console.error('❌ No access token available for profile refresh');
      return null;
    }

    try {
      console.log('🔄 Refreshing user profile...');
      const API_URL =  'https://api.watukazi.com/api/v1';
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData = await response.json();
      console.log('✅ User profile refreshed:', userData);
      
      // Update both context and storage
      updateUser(userData);
      
      return userData;
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
      throw error;
    }
  };

  const getAuthHeaders = () => {
    if (!accessToken) return {};
    
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    user,
    isAuthenticated,
    accessToken,
    loading,
    login,
    logout,
    updateUser,
    refreshUserProfile,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};