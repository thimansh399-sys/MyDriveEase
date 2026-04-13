import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { connectSocket, disconnectSocket } from '../utils/socket';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        connectSocket(token);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone, password, role) => {
    const res = await api.post('/auth/login', { phone, password, role });
    const { token, user: userData } = res.data;

    // Auto logout other role
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    connectSocket(token);
    return userData;
  };

  // Signup should NOT auto-login
  const signup = async (data) => {
    const res = await api.post('/auth/signup', data);
    // Only return user data, do not set token/user
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
