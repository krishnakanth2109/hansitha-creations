// src/context/WishlistContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { toggleWishlist as toggleWishlistAPI } from '@/api/wishlist';

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

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
