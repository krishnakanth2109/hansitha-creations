// client/src/context/AuthContext.tsx (Complete, Corrected Code)

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

// You no longer need cookieStorage for this authentication flow.
// import { cookieStorage } from '../utils/cookieStorage';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On initial app load, this function asks the backend "who am I?".
  // The browser automatically sends the secure httpOnly cookie.
  // This is the single source of truth for the user's login state.
  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    // Make the login request. The backend will set the httpOnly cookie on success.
    const res = await axios.post(`${API_URL}/api/auth/login`, credentials, {
      withCredentials: true,
    });
    // Update the user state on the frontend with the response data.
    if (res.data.success) {
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    // Tell the backend to clear the httpOnly cookie.
    await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    // Clear the user state on the frontend.
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};