import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

// ✅ Types
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  cartItems: CartItem[]; // alias
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// ✅ Placeholder for user ID (replace with your own auth system)
const getUserId = () => {
  return localStorage.getItem('userId'); // Replace this with your actual auth logic
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔁 Load from localStorage on first load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 💾 Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 🔐 Load from backend on login
  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const res = await axios.get(`/api/cart/user/${userId}`);
        const backendCart: CartItem[] = res.data.items || [];

        // Merge with local cart if exists
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const mergedCart = mergeCarts(backendCart, localCart);
        setCart(mergedCart);
        localStorage.setItem('cart', JSON.stringify(mergedCart));

        // Save merged result back to backend
        await axios.post(`/api/cart/user/${userId}`, { items: mergedCart });
      } catch (err) {
        console.error('Failed to fetch or sync cart:', err);
      }
    };

    fetchCart();
  }, []);

  // ☁️ Sync to backend on cart change (if logged in)
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      axios
        .post(`/api/cart/user/${userId}`, { items: cart })
        .catch((err) => console.error('Failed to save cart:', err));
    }
  }, [cart]);

  const mergeCarts = (a: CartItem[], b: CartItem[]) => {
    const map = new Map<string, CartItem>();
    [...a, ...b].forEach((item) => {
      if (map.has(item.id)) {
        const existing = map.get(item.id)!;
        map.set(item.id, {
          ...existing,
          quantity: existing.quantity + item.quantity,
        });
      } else {
        map.set(item.id, { ...item });
      }
    });
    return Array.from(map.values());
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
