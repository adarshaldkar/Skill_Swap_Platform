import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get('/users/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const signup = async (fullName, email, password, contract) => {
    try {
      const res = await axios.post('/auth/signup', { fullName, email, password, contract });
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get('/users/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const res = await axios.get('/users/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to load user", err);
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};