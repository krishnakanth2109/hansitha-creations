import React, { useContext, useRef } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useContext(ProductContext);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  if (loading) return <p className="p-4 text-center">Loading featured products...</p>;

  const featured = Array.isArray(products)
    ? products.filter((product) => product.featured)
    : [];

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.name}`, { state: { product } });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative p-6 bg-white">
      <h2 className="text-3xl text-center text-brandPink font-bold mb-6">
        FEATURED PRODUCTS
      </h2>

      {featured.length === 0 ? (
        <p>No featured products found.</p>
      ) : (
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 no-scrollbar scroll-smooth px-8"
          >
            {featured.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="min-w-[220px] max-w-[220px] flex-shrink-0 cursor-pointer"
              >
                <div className="overflow-hidden rounded">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-[834px] h-[364px]"
                  />
                </div>
                <h3 className="text-base font-medium mt-2 truncate">{product.name}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-lg font-semibold text-black">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
