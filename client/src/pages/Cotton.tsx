import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const Cotton: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/category/Cotton`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Cotton products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading cotton products...</p>;
  }

  if (products.length === 0) {
    return <p className="p-4 text-center text-gray-500">No Cotton Products Available.</p>;
  }

  return (
    <div className="p-6">
      {/* Hero section */}
      <div className="bg-[#f1f5f9] p-6 md:p-10 rounded-xl text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Premium Cotton Fabrics
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm md:text-base">
          Breathable. Soft. Timeless. Shop our handpicked collection of cotton fabrics perfect for any season.
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {products.map((product) => (
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

              <p className="text-xl font-bold text-green-700 mb-4">
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
                className="bg-green-600 text-white w-full px-4 py-2 rounded-full font-semibold hover:bg-green-700 active:scale-95 transition duration-200 ease-in-out mt-auto"
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

export default Cotton;
