import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SignInPanel from '../components/SignInPanel';
import { Footer } from '../components/Footer';
import BottomNavBar from '../components/BottomNavBar';

import {
  disableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetailsPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const { products } = useContext(ProductContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSidebarOpen(false);
  };
  const closeSignIn = () => setIsSignInOpen(false);

  // Scroll Lock
  useEffect(() => {
    const target = isSidebarOpen ? sidebarRef.current : isSignInOpen ? signInRef.current : null;
    if (target) disableBodyScroll(target);
    else clearAllBodyScrollLocks();
    return () => clearAllBodyScrollLocks();
  }, [isSidebarOpen, isSignInOpen]);

  // Scroll to top and load product
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadProduct = async () => {
      if (location.state?.product) {
        setProduct(location.state.product);
        return;
      }

      if (!name) return;
      setProduct(null); // clear old product

      try {
        const decodedName = decodeURIComponent(name);
        const res = await axios.get(`${API_URL}/api/products?name=${decodedName}`);

        if (res.data && res.data.length > 0) {
          setProduct(res.data[0]);
        } else {
          toast.error('Product not found.');
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        toast.error('Error loading product.');
        navigate('/');
      }
    };

    loadProduct();
  }, [name, location.state]);

  if (!product) {
    return <div className="p-6 text-center text-gray-500">Loading product...</div>;
  }

  const related = products.filter(
    (p: any) => p.category === product.category && p._id !== product._id
  );

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      <Header onMenuClick={openSidebar} />

      {isSidebarOpen && (
        <>
          <Sidebar
            ref={sidebarRef}
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            onLoginClick={openSignIn}
          />
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
        </>
      )}

      {isSignInOpen && (
        <>
          <SignInPanel ref={signInRef} isOpen={isSignInOpen} onClose={closeSignIn} />
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSignIn} />
        </>
      )}

      <div className="p-6 pb-32 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

        <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500">
              <Link to="/" className="hover:underline text-blue-600">Home</Link>
              {product.breadcrumb?.map((crumb: string, i: number) => (
                <>
                  {' > '}
                  <Link
                    key={i}
                    to={`/categories/${encodeURIComponent(crumb.toLowerCase())}`}
                    className="hover:underline text-blue-600"
                  >
                    {crumb}
                  </Link>
                </>
              ))}
              {' > '}<span className="text-gray-800 font-medium">{product.name}</span>
            </p>

            <p className="text-gray-600">
              <strong>Category:</strong> {product.category}
            </p>

            <p className="text-gray-700 text-lg">
              <strong>Stock:</strong>{' '}
              <span className={product.stock === 0 ? 'text-red-600' : ''}>
                {product.stock === 0 ? 'Out of Stock' : product.stock}
              </span>
            </p>

            <p className="text-gray-600 whitespace-pre-line">
              <strong>Description:</strong> <br />
              {product.description}</p>

            <p className="text-2xl font-bold text-green-600">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${product.stock === 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border text-center rounded-lg shadow hover:shadow-md transition p-4 cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${encodeURIComponent(item.name)}`, {
                      state: { product: item },
                    })
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-cover rounded mb-2"
                  />
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-blue-600 font-bold mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${product.stock === 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      <div className="fixed bottom-0 left-0 right-0 z-0 block lg:hidden">
        <BottomNavBar onAccountClick={openSignIn} />
      </div>
    </>
  );
};

export default ProductDetailsPage;
