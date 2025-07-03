import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Footer } from '@/components/Footer';
import { PromoSection } from '@/components/PromoSection';
import { HeroSection } from '@/components/HeroSection';
import FeaturedProducts from '@/pages/FeaturedProducts';
import { HeroPromo } from '@/components/HeroPromo';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [carouselSlides, setCarouselSlides] = useState([
    { image: "", heading: "", subtext: "" },
    { image: "", heading: "", subtext: "" },
    { image: "", heading: "", subtext: "" }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // ✅ Navigation buttons
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  // ✅ Add to cart handler
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <HeroPromo />
      <FeaturedProducts />
      <PromoSection />
      <Footer />
    </div>
  );
};

export default Home;
