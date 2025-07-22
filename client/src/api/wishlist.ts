import axios from 'axios';

export const toggleWishlist = async (productId: string) => {
  const res = await axios.post('/api/wishlist/toggle', { productId }, { withCredentials: true });
  return res.data.wishlist;
};

export const fetchWishlist = async () => {
  const res = await axios.get('/api/wishlist', { withCredentials: true });
  return res.data.wishlist;
};
