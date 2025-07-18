import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Heart, HeartIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWishlist } from '@/context/WishlistContext';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { products, loading } = useProductContext();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { wishlist, toggleWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState('default');
  const navigate = useNavigate();

  const filteredProducts = products
    .filter((p) => p.category?.toLowerCase().trim() === category?.toLowerCase().trim())
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.name}`, { state: { product } });
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold capitalize">
          {category} Fabrics ({filteredProducts.length})
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product._id);
            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="snap-start min-w-[220px] max-w-[220px] bg-white border rounded-lg shadow hover:shadow-md transition p-4 text-center cursor-pointer flex-shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-48 rounded mb-2"
                />
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate">{product.category}</p>
                <p className="text-blue-600 font-bold mt-1">
                  {formatPrice(product.price)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity: 1,
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                  className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full font-semibold transition active:scale-95 mt-4"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
