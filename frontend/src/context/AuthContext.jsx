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

  const login = async (phoneOrPayload, passwordArg, roleArg) => {

  const credentials =
    typeof phoneOrPayload === 'object'
      ? phoneOrPayload
      : {
          phone: phoneOrPayload,
          password: passwordArg,
          role: roleArg,
        };

  const res = await api.post('/auth/login', {

    phone: credentials.phone,
    password: credentials.password,
    role: credentials.role,

  });

  localStorage.setItem(
    'token',
    res.data.token
  );

  localStorage.setItem(
    'user',
    JSON.stringify(res.data.user)
  );

  setUser(res.data.user);
  connectSocket(res.data.token);

  return res.data.user;

};

  // Signup should NOT auto-login
  const signup = async (data) => {
    const res = await api.post('/auth/signup', data);
    // Only return user data, do not set token/user
    return res.data.user || res.data.driver;
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
