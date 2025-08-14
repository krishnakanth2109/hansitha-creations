import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// UPDATE THE USER INTERFACE TO HOLD ALL RELEVANT DATA
interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  wishlist: any[];  // This is crucial for the wishlist page
  addresses: any[]; // This is crucial for the address page
  cart: any[];      // Also good to have cart data here
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (userData: { name: string; email: string; password?: string }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  googleLogin: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user); // Sets the full user object
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

  const register = async (userData: { name: string; email: string; password?: string }) => {
    await axios.post(`${API_URL}/api/auth/register`, userData, { withCredentials: true });
  };

  const login = async (credentials: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, credentials, {
      withCredentials: true,
    });
    if (res.data.success) {
      setUser(res.data.user); // Sets the full user object
    }
  };

  const googleLogin = async (token: string) => {
    const res = await axios.post(`${API_URL}/api/auth/google-login`, { token }, {
      withCredentials: true,
    });
    if (res.data.success) {
      setUser(res.data.user); // Sets the full user object
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};