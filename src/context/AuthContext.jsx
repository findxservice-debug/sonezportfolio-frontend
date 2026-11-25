import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sonez_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.verifySession();
          if (res.success && res.admin) {
            setAdmin(res.admin);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('sonez_admin_token', res.token);
      setToken(res.token);
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('sonez_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
