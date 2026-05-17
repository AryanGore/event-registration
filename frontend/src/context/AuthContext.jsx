import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username || username);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser({ token: res.data.token, username: res.data.username || username });
  };

  const register = async (username, password) => {
    const res = await axios.post('/api/auth/register', { username, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', username);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser({ token: res.data.token, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
