import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useCart();

  if (loading) return <p className="p-4 text-center">Loading featured products...</p>;

  const featured = Array.isArray(products)
    ? products.filter((product) => product.featured)
    : [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🌟 Featured Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {featured.map((product) => (
          <div
            key={product._id}
            className="bg-white border shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />

            <div className="p-4 flex flex-col h-full">
              <h3 className="text-lg font-semibold">{product.name}</h3>

              <div className="flex items-center mt-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating ?? 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  ({product.reviews ?? 0})
                </span>
              </div>

              <p className="text-xl font-bold text-blue-600 mb-4">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </p>

              <button
                onClick={() => {
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  });
                  toast.success(`${product.name} added to cart!`);
                }}
                className="bg-blue-600 text-white w-full px-4 py-2 rounded-full font-semibold hover:bg-blue-700 active:scale-95 transition duration-200 ease-in-out mt-auto"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
