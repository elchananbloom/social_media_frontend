// src/providers/AuthProvider.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContextValue, User } from '../utils/types';
import base_url from '../utils/url';

export const AuthContext = createContext<AuthContextValue | null>(null);

// configure axios base URL for API calls
axios.defaults.baseURL = `${base_url}/api`;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    useEffect(() => {
        // restore token if stored and set default header
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    const navigate = useNavigate();

    const signup = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:9000/api/users/register', { username, email, password });
            console.log("Registration successful:", response.data);

            // Redirect to login page after successful signup
            navigate('/login');
            return response.data;
        } catch (error: any) {
            // normalize and rethrow backend payload if present so UI can read errorMessage / suggestionNames
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw error;
        }
    };

    const login = async (name: string, password: string) => {
        try {
            const response = await axios.post('/users/login', { username: name, password });
            const raw = response.data;
    const token =
      raw?.token ||
      raw?.accessToken ||
      raw?.access_token ||
      (typeof raw === "string" ? raw : null);

    console.log("login response:", raw);
    console.log("token extracted:", token);

    if (!token || typeof token !== "string") {
      throw new Error("Login succeeded but no token string was returned");
    }
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            // set minimal user info (backend doesn't return full user here). Adjust to fetch current user if API provides.
            const minimalUser: User = { username: name, password: '' };
            setUser(minimalUser);

            // Check if user has a profile
            try {
                const profileResponse = await axios.get(`http://localhost:8082/profiles/${name}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("User has profile:", profileResponse.data);
                navigate('/');
            } catch (profileError: any) {
                // Backend returns 500 instead of 404 for missing profiles
                if (profileError.response?.status === 404 || profileError.response?.status === 500) {
                    console.log("User doesn't have a profile, redirecting to create-profile");
                    navigate('/create-profile');
                } else {
                    console.error("Error checking profile:", profileError);
                    navigate('/');
                }
            }

            return token;
        } catch (error: any) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const value: AuthContextValue = { user, signup, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
