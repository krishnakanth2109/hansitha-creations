import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// Define the shape of the context
interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Transform database wishlist to string array
  const transformDbWishlistToStringArray = (dbWishlist: any[]): string[] => {
    return dbWishlist.map((item) => (typeof item === 'object' ? item._id : item));
  };

  // Refresh wishlist from database
  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      localStorage.removeItem("wishlist");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/users/wishlist`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const transformedWishlist = transformDbWishlistToStringArray(response.data.wishlist);
        setWishlist(transformedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(transformedWishlist));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // Fallback to localStorage if user is logged in but API fails
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    }
  };

  // Load wishlist on user change
  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      // If not logged in, load from localStorage
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        setWishlist(JSON.parse(stored));
      } else {
        setWishlist([]);
      }
    }
  }, [user]);

  // Save wishlist to localStorage when it changes (for offline fallback)
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle item in wishlist
  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (user) {
      try {
        const response = await axios.post(
          `${API_URL}/api/users/wishlist`,
          { productId },
          { withCredentials: true }
        );
        if (response.data.success) {
          const transformedWishlist = transformDbWishlistToStringArray(response.data.wishlist);
          setWishlist(transformedWishlist);
          return response.data.action === 'added';
        }
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        // Fallback to local state update
        const exists = wishlist.includes(productId);
        if (exists) {
          setWishlist((prev) => prev.filter((id) => id !== productId));
          return false; // Removed
        } else {
          setWishlist((prev) => [...prev, productId]);
          return true; // Added
        }
      }
    } else {
      // Not logged in, update localStorage only
      const exists = wishlist.includes(productId);
      if (exists) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        return false; // Removed
      } else {
        setWishlist((prev) => [...prev, productId]);
        return true; // Added
      }
    }
    return false;
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (user) {
      try {
        await axios.delete(`${API_URL}/api/users/wishlist`, {
          withCredentials: true,
        });
        setWishlist([]);
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        // Fallback to local state update
        setWishlist([]);
      }
    } else {
      // Not logged in, clear localStorage only
      setWishlist([]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
