import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { cookieStorage } from "../utils/cookieStorage";

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

  // Refresh wishlist from database and merge with any guest items
  const refreshWishlist = async () => {
    if (!user) {
      // If not logged in, load from cookies
      const stored = cookieStorage.getJSON<string[]>("wishlist");
      if (stored) {
        setWishlist(stored);
      } else {
        setWishlist([]);
      }
      return;
    }

    try {
      // Get current guest wishlist from cookies
      const guestItems = cookieStorage.getJSON<string[]>("wishlist") || [];

      // Fetch user's wishlist from database
      const response = await axios.get(`${API_URL}/api/users/wishlist`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        const dbWishlist = transformDbWishlistToStringArray(response.data.wishlist);
        
        // Merge guest wishlist with database wishlist (remove duplicates)
        const mergedWishlist = [...new Set([...dbWishlist, ...guestItems])];
        
        // If there are new items from guest session, sync them to database
        const newItems = guestItems.filter(item => !dbWishlist.includes(item));
        if (newItems.length > 0) {
          console.log('Syncing guest wishlist items to database:', newItems);
          // Sync each new item to database
          for (const productId of newItems) {
            try {
              await axios.post(`${API_URL}/api/users/wishlist`, 
                { productId }, 
                { withCredentials: true }
              );
            } catch (syncError) {
              console.error('Error syncing wishlist item:', productId, syncError);
            }
          }
        }
        
        setWishlist(mergedWishlist);
        cookieStorage.setJSON("wishlist", mergedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // Fallback to cookies if user is logged in but API fails
      const stored = cookieStorage.getJSON<string[]>("wishlist");
      if (stored) {
        setWishlist(stored);
      }
    }
  };

  // Load wishlist on user change
  useEffect(() => {
    refreshWishlist();
  }, [user]);

  // Save wishlist to cookies when it changes (for offline fallback)
  useEffect(() => {
    cookieStorage.setJSON("wishlist", wishlist);
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
      // Not logged in, update cookies only
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
        cookieStorage.setJSON("wishlist", []);
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        // Fallback to local state update
        setWishlist([]);
        cookieStorage.setJSON("wishlist", []);
      }
    } else {
      // Not logged in, clear cookies and state
      setWishlist([]);
      cookieStorage.setJSON("wishlist", []);
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
