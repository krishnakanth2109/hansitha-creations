import axios from 'axios';

export const toggleWishlist = async (productId: string): Promise<string[]> => {
  try {
    const res = await axios.post(
      '/api/wishlist/toggle',
      { productId },
      { withCredentials: true }
    );
    return res.data.wishlist; // Expecting string[]
  } catch (error: any) {
    console.error('❌ toggleWishlist API failed:', error.response?.data || error.message);
    throw new Error('Failed to toggle wishlist');
  }
};

export const fetchWishlist = async (): Promise<string[]> => {
  try {
    const res = await axios.get('/api/wishlist', { withCredentials: true });
    return res.data.wishlist; // Expecting string[]
  } catch (error: any) {
    console.error('❌ fetchWishlist API failed:', error.response?.data || error.message);
    throw new Error('Failed to fetch wishlist');
  }
};
