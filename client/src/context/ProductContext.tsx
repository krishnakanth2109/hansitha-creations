import React, { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

// ✅ Define the Product type
export type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  featured?: boolean;
  rating: number;
  reviews: number;
};

// ✅ Context type
type ProductContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  featured: Product[];
};

// ✅ Create context
export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  loading: true,
  featured: [],
});

// ✅ Provider
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]); // fallback if server sends unexpected type
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]); // ensure fallback array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featured = Array.isArray(products)
    ? products.filter((p) => p.featured)
    : [];

  return (
    <ProductContext.Provider value={{ products, setProducts, loading, featured }}>
      {children}
    </ProductContext.Provider>
  );
};
