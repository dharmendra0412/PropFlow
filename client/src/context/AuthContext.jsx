import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load session on startup
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }

      // Load properties for registration dropdown and selection
      try {
        const propRes = await api.getProperties();
        if (propRes.success) {
          setProperties(propRes.properties || []);
          if (propRes.properties && propRes.properties.length > 0) {
            setSelectedProperty(propRes.properties[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      setShowAuthModal(false);
      refreshProperties();
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success) {
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      setShowAuthModal(false);
      refreshProperties();
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const refreshProperties = async () => {
    try {
      const propRes = await api.getProperties();
      if (propRes.success) {
        setProperties(propRes.properties || []);
        if (propRes.properties.length > 0 && !selectedProperty) {
          setSelectedProperty(propRes.properties[0]);
        }
      }
    } catch (err) {
      console.error('Error refreshing properties:', err);
    }
  };

  const switchProperty = (property) => {
    setSelectedProperty(property);
  };

  const isOwner = currentUser?.role === 'owner' || currentUser?.role === 'manager';
  const isTenant = currentUser?.role === 'tenant';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        properties,
        selectedProperty,
        login,
        register,
        logout,
        switchProperty,
        refreshProperties,
        isOwner,
        isTenant,
        loading,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
