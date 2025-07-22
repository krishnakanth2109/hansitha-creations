// src/api/wishlist.ts
import axios from 'axios';

export const toggleWishlist = async (productId: string) => {
  try {
    const res = await axios.post(
      '/api/wishlist/toggle',
      { productId },
      { withCredentials: true }
    );
    return res.data.wishlist;
  } catch (err) {
    console.error('Wishlist error', err);
    throw err;
  }
};
