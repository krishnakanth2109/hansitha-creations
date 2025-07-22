// src/context/WishlistContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { toggleWishlist as toggleWishlistAPI, fetchWishlist } from '@/api/wishlist';
import { useAuth } from './AuthContext'; // Make sure you have access to user state

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth(); // This will change on login/logout

  // 🔁 Re-fetch wishlist when user logs in
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const data = await fetchWishlist();
          setWishlist(data);
        } catch (error) {
          console.error('Failed to fetch wishlist', error);
        }
      } else {
        setWishlist([]); // Clear when user logs out
      }
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    try {
      const updated = await toggleWishlistAPI(productId);
      setWishlist(updated);
    } catch (error) {
      console.error('Toggle failed', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
