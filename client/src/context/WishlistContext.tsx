// WishlistContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  refreshWishlist: () => {},
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const refreshWishlist = async () => {
    try {
      const res = await axios.get("/api/user/me", { withCredentials: true });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`/api/user/wishlist/${productId}`, {
          withCredentials: true,
        });
      } else {
        await axios.post(
          `/api/user/wishlist`,
          { productId },
          { withCredentials: true }
        );
      }

      refreshWishlist();
    } catch (err) {
      console.error("Toggle wishlist failed", err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
