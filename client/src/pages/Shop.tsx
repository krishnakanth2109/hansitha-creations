import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/context/CurrencyContext';
import { Footer } from '../components/Footer';

const Shop: React.FC = () => {
  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <p className="p-4 text-center">Loading products...</p>;

  const productList = Array.isArray(products) ? products : [];

  const filtered = productList
    .filter((product) => {
      return (
        product.price >= minPrice &&
        product.price <= maxPrice &&
        (selectedCategory ? product.category === selectedCategory : true)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.name}`, { state: { product } });
  };

  const uniqueCategories = [...new Set(productList.map((p) => p.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-4 flex-grow">
        {/* Header with Filter button on Mobile */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🛍️ Products</h2>
          <button
            onClick={() => setShowFilterMobile(true)}
            className="bg-blue-50 text-blue-700 border border-blue-300 px-4 py-2 rounded-md shadow font-medium hover:bg-blue-100 transition"
          >
            ☰ Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[20%_80%] gap-6">
          {/* Sidebar Filter */}
          <aside
            className={clsx(
              'bg-white w-full lg:w-auto p-6 overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg',
              {
                'fixed inset-x-0 bottom-0 transform translate-y-0 z-40': showFilterMobile && isMobile,
                'fixed inset-x-0 bottom-0 transform translate-y-full z-40': !showFilterMobile && isMobile,
                'lg:sticky top-[100px] block': true,
              }
            )}
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilterMobile(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <div className="space-y-1">
                  {uniqueCategories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => {
                          setSelectedCategory(cat);
                          if (isMobile) setShowFilterMobile(false);
                        }}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === null}
                      onChange={() => {
                        setSelectedCategory(null);
                        if (isMobile) setShowFilterMobile(false);
                      }}
                    />
                    <span>All</span>
                  </label>
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold mb-2">Price</h3>
                <div className="flex items-center gap-2">
                  ₹
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20"
                  />
                  to ₹
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Default</option>
                  <option value="asc">Price: Low → High</option>
                  <option value="desc">Price: High → Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product List */}
          <section className="lg:pl-0">
            {filtered.length === 0 ? (
              <p>No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => {
                  const isLowStock = product.stock <= 5 && product.stock > 0;
                  const isOutOfStock = product.stock === 0;

                  return (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product)}
                      className="bg-white border rounded-xl shadow hover:shadow-md transition p-4 flex flex-col cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover rounded mb-3"
                      />
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span
                          className={`font-medium ${isLowStock ? 'text-orange-500' : 'text-gray-600'}`}
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
                        {formatPrice(product.price)}
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
          </section>
        </div>
      </main>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

export default Shop;
