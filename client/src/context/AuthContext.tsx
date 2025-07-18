import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import axios, { AxiosError } from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
   wishlist?: string[];
  cart?: {
    productId: string;
    quantity: number;
  }[];
  // Add more fields if needed
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string }) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const latestUser = response.data.user;
      if (latestUser) {
        setUser(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Handle refresh failure, e.g., by logging out the user
      logout();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      refreshUser(); // Also refresh user data on initial load
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
  try {
    // Basic validation (optional but helpful)
    if (!credentials.email || !credentials.password) {
      return { success: false, message: 'Email and password are required' };
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      credentials,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const loggedInUser = response.data.user;

    if (!loggedInUser) {
      return { success: false, message: 'Invalid login response' };
    }

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    return { success: true };
  } catch (error: unknown) {
    const err = error as AxiosError<any>;
    console.error('Login Error:', err.response?.data || err.message);

    return {
      success: false,
      message: err.response?.data?.message || 'Login failed. Please try again.',
    };
  }
};


  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};