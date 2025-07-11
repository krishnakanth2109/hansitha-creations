import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SignInPanel from '../components/SignInPanel';
import BottomNavBar from '../components/BottomNavBar';
import { Footer } from '@/components/Footer';
import { PromoSection } from '@/components/PromoSection';
import { HeroSection } from '@/components/HeroSection';
import FeaturedProducts from '@/pages/FeaturedProducts';
import { HeroPromo } from '@/components/HeroPromo';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const { addToCart } = useCart();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Replace this with dynamic cart count if needed

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [carouselSlides, setCarouselSlides] = useState([
    { image: "", heading: "", subtext: "" },
    { image: "", heading: "", subtext: "" },
    { image: "", heading: "", subtext: "" }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSidebarOpen(false); // Close sidebar when opening sign-in
  };
  const closeSignIn = () => setIsSignInOpen(false);

  // ✅ Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setFeaturedProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Fetch carousel images
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/carousel-images`);
        const mapping = {
          carousel1: { image: "", heading: "", subtext: "" },
          carousel2: { image: "", heading: "", subtext: "" },
          carousel3: { image: "", heading: "", subtext: "" },
        };

        res.data.forEach((item: any) => {
          if (mapping[item.carouselId]) {
            mapping[item.carouselId] = {
              image: item.imageUrl,
              heading: item.heading,
              subtext: item.subtext,
            };
          }
        });

        setCarouselSlides([
          mapping.carousel1,
          mapping.carousel2,
          mapping.carousel3,
        ]);
      } catch (err) {
        console.error("Failed to load carousel images", err);
      }
    };

    fetchCarouselImages();
  }, []);

  // ✅ Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // ✅ Add to cart
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Page Content */}
      <HeroSection />
      <HeroPromo />
      <FeaturedProducts />
      <PromoSection />
      <Footer />
      {/* Bottom Navigation - mobile only and sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-30 block lg:hidden">
        <BottomNavBar onAccountClick={openSignIn} />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onLoginClick={openSignIn}
      />

      {/* Sign In Panel */}
      <SignInPanel
        isOpen={isSignInOpen}
        onClose={closeSignIn}
      />

      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Overlay for Sign In */}
      {isSignInOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSignIn}
        />
      )}
    </div>
  );
};

export default Home;
