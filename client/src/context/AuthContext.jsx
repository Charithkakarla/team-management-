import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../services/authService';

const AuthContext = createContext(null);

const storageUserKey = 'rbac_user';
const storageTokenKey = 'rbac_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(storageUserKey);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(storageTokenKey) || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(storageUserKey);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(storageTokenKey, token);
    } else {
      localStorage.removeItem(storageTokenKey);
    }
  }, [token]);

  const authAction = async (request, payload) => {
    setLoading(true);
    try {
      const response = await request(payload);
      setUser(response.data.user);
      setToken(response.data.token);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login: (payload) => authAction(loginRequest, payload),
      register: (payload) => authAction(registerRequest, payload),
      logout: () => {
        setUser(null);
        setToken('');
      }
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
