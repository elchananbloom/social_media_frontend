import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContextValue, User } from '../utils/types';
import base_url from '../utils/url';

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const navigate = useNavigate();

  const signup = async (username: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await axios.post(`${base_url}/users/register`, { username, password, firstName, lastName });
      setUser(response.data);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const login = async (name: string, password: string) => {
    try {
      const response = await axios.post(`${base_url}/users/login`, { username: name, password });
      setUser(response.data);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const value: AuthContextValue = { user, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}