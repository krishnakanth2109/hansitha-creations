import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

export type CartItem = {
  product: string;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/cart`, { withCredentials: true });
      const data = response?.data;
      if (!data || !data.cart) throw new Error("Cart is null or invalid");
      setCart(data.cart);
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart([]); // fallback to empty
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await axios.post(
        "/api/user/cart",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      refreshCart();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`/api/user/cart/${productId}`, {
        withCredentials: true,
      });
      refreshCart();
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await axios.post(
        "/api/user/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      refreshCart();
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const clearCart = () => {
    setCart([]);
    // Optionally clear from backend one by one
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
