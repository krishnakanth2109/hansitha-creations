import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FeaturedProducts: React.FC = () => {
  const { featured, loading } = useContext(ProductContext);
  const { addToCart } = useCart();

  if (loading) return <p className="p-4 text-center">Loading featured products...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {featured.map((product) => (
          <div
            key={product._id}
            className="bg-white border shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex items-center mt-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-blue-600">₹{product.price}</p>
                <button
                  onClick={() =>
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    })
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
