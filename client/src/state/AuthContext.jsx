// Auth state: stores the logged-in user and JWT in local storage.
// It handles login, register, and logout state.
// Use this file to understand session persistence on the client.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest, getCurrent as getCurrentRequest } from '../api/authService';
import { API_BASE_URL } from '../api/api';

const AuthContext = createContext(null);

const storageUserKey = 'rbac_user';
const storageTokenKey = 'rbac_token';
const buildRealtimeStreamUrl = (token) => {
  const baseUrl = API_BASE_URL;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(`realtime/stream?token=${encodeURIComponent(token)}`, normalizedBaseUrl).toString();
};

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

  const refreshUser = useCallback(async () => {
    try {
      const res = await getCurrentRequest();
      if (res?.data?.user) setUser(res.data.user);
    } catch (err) {
      // ignore and keep current user
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    const syncUser = async () => {
      if (!active) {
        return;
      }

      await refreshUser();
    };

    syncUser();

    const handleFocus = () => {
      syncUser();
    };

    const intervalId = window.setInterval(syncUser, 15000);
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token, refreshUser]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const streamUrl = buildRealtimeStreamUrl(token);
    const eventSource = new EventSource(streamUrl);

    const syncFromRoleChange = async () => {
      await refreshUser();
      window.dispatchEvent(new CustomEvent('rbac:sync'));
    };

    const handleRoleChange = () => {
      syncFromRoleChange();
    };

    const handleError = () => {
      // Let the browser retry automatically; this keeps the setup robust without noisy errors.
    };

    eventSource.addEventListener('role-change', handleRoleChange);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.removeEventListener('role-change', handleRoleChange);
      eventSource.removeEventListener('error', handleError);
      eventSource.close();
    };
  }, [token, refreshUser]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login: (payload) => authAction(loginRequest, payload),
      register: (payload) => authAction(registerRequest, payload),
      refreshUser,
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
