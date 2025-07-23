import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Sidebar from '../components/Sidebar';
import BottomNavBar from '../components/BottomNavBar';
import { Footer } from '@/components/Footer';
import { PromoSection } from '@/components/PromoSection';
import { HeroSection } from '@/components/HeroSection';
import FeaturedProducts from '@/pages/FeaturedProducts';
import CategoryCircle from '@/components/CategoryCircle';
import SearchSidebar from '@/components/SearchSidebar';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

const API_URL = import.meta.env.VITE_API_URL;

// Types
interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CarouselSlide {
  image: string;
  heading: string;
  subtext: string;
}

const Home = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([
    { image: '', heading: '', subtext: '' },
    { image: '', heading: '', subtext: '' },
    { image: '', heading: '', subtext: '' },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Open/close handlers
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSidebarOpen(false);
  };

  const closeSignIn = () => setIsSignInOpen(false);

  // Scroll lock logic
  useEffect(() => {
    const target = isSidebarOpen ? sidebarRef.current : isSignInOpen ? signInRef.current : null;

    if (target) {
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }

    return () => clearAllBodyScrollLocks();
  }, [isSidebarOpen, isSignInOpen]);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setFeaturedProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch carousel images
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/carousel-images`);
        const mapping: Record<string, CarouselSlide> = {
          carousel1: { image: '', heading: '', subtext: '' },
          carousel2: { image: '', heading: '', subtext: '' },
          carousel3: { image: '', heading: '', subtext: '' },
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

        setCarouselSlides([mapping.carousel1, mapping.carousel2, mapping.carousel3]);
      } catch (err) {
        console.error('Failed to load carousel images', err);
      }
    };

    fetchCarouselImages();
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Add to cart
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Category Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-brandBlue mb-8 text-center">
            SHOP BY CATEGORY
          </h2>
          <CategoryCircle />
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Promotions */}
      <PromoSection />

      {/* Footer */}
      <Footer />

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <Sidebar ref={sidebarRef} isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        </>
      )}

      {/* Search Panel */}
      <SearchSidebar isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Bottom Nav (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden">
        <BottomNavBar
          onAccountClick={() => {}}
          onSearchClick={() => setShowSearch(true)}
        />
      </div>
    </div>
  );
};

export default Home;
