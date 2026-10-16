import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On load, if a token is already stored, verify it against the backend
  // and restore the session; otherwise clear whatever stale token exists.
  useEffect(() => {
    async function restoreSession() {
      if (api.getToken()) {
        try {
          const { user: me } = await api.getMe();
          setUser(me);
        } catch {
          api.setToken(null);
        }
      }
      setAuthLoading(false);
    }
    restoreSession();
  }, []);

  async function register({ name, email, phone }) {
    try {
      const data = await api.register({ name, email, phone });
      return { success: true, email, devOtp: data.devOtp };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  }

  async function requestLoginOtp(email) {
    try {
      const data = await api.requestLoginOtp(email);
      return { success: true, email, devOtp: data.devOtp, message: data.message };
    } catch (err) {
      return { success: false, message: err.message || 'Could not send OTP.' };
    }
  }

  async function verifyLoginOtp(email, otp) {
    try {
      const data = await api.verifyLoginOtp(email, otp);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid OTP.' };
    }
  }

  // Backward-compatible login helper for any older component.
  async function login({ email }) {
    return requestLoginOtp(email);
  }

  function logout() {
    api.logout();
    setUser(null);
  }

  async function adminLogin({ email, password }) {
    try {
      const data = await api.adminLogin({ email, password });
      setAdmin(data.admin);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid admin credentials.' };
    }
  }

  function adminLogout() {
    api.adminLogout();
    setAdmin(null);
  }

  function isAuthenticated() {
    return Boolean(user);
  }

  function isAdminAuthenticated() {
    // Consider the admin "logged in" if a token exists locally — protected
    // admin API calls will reject with 401 if it's actually expired/invalid,
    // at which point AdminLayout's logout button clears it.
    return Boolean(admin) || Boolean(api.getAdminToken());
  }

  const value = {
    user,
    admin,
    authLoading,
    login,
    requestLoginOtp,
    verifyLoginOtp,
    register,
    logout,
    isAuthenticated,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
