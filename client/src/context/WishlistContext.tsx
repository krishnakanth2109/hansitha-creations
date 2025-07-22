// src/context/WishlistContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { toggleWishlist as toggleWishlistAPI } from '@/api/wishlist';
import { useAuth } from './AuthContext'; // ⬅️ Import your auth context

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth(); // ⬅️ Get logged-in user from AuthContext

  useEffect(() => {
    // ⬅️ Sync wishlist when user changes
    if (user?.wishlist && Array.isArray(user.wishlist)) {
      setWishlist(user.wishlist);
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    try {
      const updated = await toggleWishlistAPI(productId);
      setWishlist(updated); // Updated wishlist from backend
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
