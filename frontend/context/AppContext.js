import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, authHeaders, getApiBase } from '../services/api';

const STORAGE_SUBJECT = '@friendfind_active_subject';
const STORAGE_TOKEN = '@friendfind_token';
const STORAGE_USER = '@friendfind_user';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeSubject, setActiveSubjectState] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [subJson, tok, userJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_SUBJECT),
          AsyncStorage.getItem(STORAGE_TOKEN),
          AsyncStorage.getItem(STORAGE_USER),
        ]);
        if (subJson) setActiveSubjectState(JSON.parse(subJson));
        if (tok) setToken(tok);
        if (userJson) setUser(JSON.parse(userJson));
      } catch (e) {
        console.warn('Restore session failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setActiveSubject = useCallback(async (subject) => {
    setActiveSubjectState(subject);
    try {
      if (subject) {
        await AsyncStorage.setItem(STORAGE_SUBJECT, JSON.stringify(subject));
      } else {
        await AsyncStorage.removeItem(STORAGE_SUBJECT);
      }
    } catch (e) {
      console.warn('AsyncStorage error:', e);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, data.token);
      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(data.user));
    } catch (e) {
      console.warn('AsyncStorage error:', e);
    }
    return data;
  }, []);

  const register = useCallback(
    async ({ username, email, password, faculty, year, interests, profile_image_url }) => {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          faculty,
          year,
          interests,
          profile_image_url,
        }),
      });
      return data;
    },
    []
  );

  const mockSetUser = useCallback(async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(userData));
    } catch (e) {
      console.warn('AsyncStorage error:', e);
    }
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    try {
      await AsyncStorage.multiRemove([STORAGE_TOKEN, STORAGE_USER]);
    } catch (e) {
      console.warn('AsyncStorage error:', e);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    return apiFetch('/api/subjects');
  }, []);

  const fetchUsersByActiveSubject = useCallback(
    async (subjectCode) => {
      const code = encodeURIComponent(subjectCode);
      return apiFetch(`/api/users/active-subject/${code}`);
    },
    []
  );

  const fetchGroups = useCallback(
    async (subjectId) => {
      const q = subjectId ? `?subject_id=${encodeURIComponent(subjectId)}` : '';
      return apiFetch(`/api/groups${q}`);
    },
    []
  );

  const createGroup = useCallback(
    async (body) => {
      return apiFetch('/api/groups', {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
    },
    [token]
  );

  const joinGroup = useCallback(
    async (groupId) => {
      return apiFetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: authHeaders(token),
      });
    },
    [token]
  );

  const value = useMemo(
    () => ({
      loading,
      activeSubject,
      setActiveSubject,
      token,
      user,
      login,
      register,
      mockSetUser,
      logout,
      fetchSubjects,
      fetchUsersByActiveSubject,
      fetchGroups,
      createGroup,
      joinGroup,
      apiBase: getApiBase(),
    }),
    [
      loading,
      activeSubject,
      setActiveSubject,
      token,
      user,
      login,
      register,
      mockSetUser,
      logout,
      fetchSubjects,
      fetchUsersByActiveSubject,
      fetchGroups,
      createGroup,
      joinGroup,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
