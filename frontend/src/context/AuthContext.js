import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bb_token');
    const saved = localStorage.getItem('bb_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      // Verify token still valid
      api.get('/auth/me')
        .then(res => { setUser(res.data.user); localStorage.setItem('bb_user', JSON.stringify(res.data.user)); })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('bb_token', res.data.token);
    localStorage.setItem('bb_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}! 🍽️`);
    return res.data.user;
  };

  const register = async (name, email, password, city) => {
    const res = await api.post('/auth/register', { name, email, password, city });
    localStorage.setItem('bb_token', res.data.token);
    localStorage.setItem('bb_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome to BudgetBite, ${name}! 🎉`);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bb_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
