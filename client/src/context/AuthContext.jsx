import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('miniCrmToken') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('miniCrmUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setAuthToken('');
      return;
    }

    setAuthToken(token);

    const verifySession = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.admin);
        localStorage.setItem('miniCrmUser', JSON.stringify(response.data.admin));
      } catch (error) {
        localStorage.removeItem('miniCrmToken');
        localStorage.removeItem('miniCrmUser');
        setToken('');
        setUser(null);
        setAuthToken('');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, admin } = response.data;

    localStorage.setItem('miniCrmToken', newToken);
    localStorage.setItem('miniCrmUser', JSON.stringify(admin));
    setToken(newToken);
    setUser(admin);
    setAuthToken(newToken);

    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout is client-side safe even if the token is already expired.
    }

    localStorage.removeItem('miniCrmToken');
    localStorage.removeItem('miniCrmUser');
    setToken('');
    setUser(null);
    setAuthToken('');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
