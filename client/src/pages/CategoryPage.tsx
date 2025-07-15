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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product._id);
            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="cursor-pointer relative group"
              >
                {/* Wishlist Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow-md transition-transform duration-150 active:scale-125"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? (
                    <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-5 h-5 text-red-500" />
                  )}
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-[834px] h-[364px]"
                />
                <h3 className="text-base font-semibold truncate mt-2">{product.name}</h3>
                <p className="text-blue-600 font-bold text-sm mb-2">{formatPrice(product.price)}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                  className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full font-semibold transition active:scale-95"
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
