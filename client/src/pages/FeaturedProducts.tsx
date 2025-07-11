import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <p className="p-4 text-center">Loading featured products...</p>;

  const featured = Array.isArray(products)
    ? products.filter((product) => product.featured)
    : [];

  const handleProductClick = (product: any) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🌟 Featured Products</h2>

      {featured.length === 0 ? (
        <p>No featured products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {featured.map((product) => {
            const isLowStock = product.stock <= 5 && product.stock > 0;
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="bg-white border rounded-lg shadow hover:shadow-md transition p-4 flex flex-col cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover rounded mb-3"
                />

                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating ?? 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2">({product.reviews ?? 0})</span>
                  </div>
                  <span
                    className={`font-medium ${
                      isLowStock ? 'text-orange-500' : 'text-gray-600'
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>

                {isLowStock && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded mb-2 w-max">
                    Low Stock
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded mb-2 w-max">
                    Out of Stock
                  </span>
                )}

                <p className="text-blue-600 font-bold text-xl mb-4">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isOutOfStock) return;
                    addToCart({
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    });
                    toast.success(`${product.name} added to cart!`);
                  }}
                  disabled={isOutOfStock}
                  className={`mt-auto px-4 py-2 rounded-full font-semibold transition duration-200 ease-in-out ${
                    isOutOfStock
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
