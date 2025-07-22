import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { toggleWishlist as toggleWishlistAPI, fetchWishlist } from '@/api/wishlist';
import { useAuth } from './AuthContext';

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // 🔁 Fetch wishlist when user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const data = await fetchWishlist(); // should return string[]
          setWishlist(data);
        } catch (error) {
          console.error('❌ Failed to fetch wishlist', error);
        }
      } else {
        setWishlist([]); // Clear on logout
      }
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    try {
      const updatedWishlist = await toggleWishlistAPI(productId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('❌ Wishlist toggle failed:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
