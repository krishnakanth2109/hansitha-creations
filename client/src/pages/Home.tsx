import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Footer } from '../pages/footer'; // adjust the path as needed
import { PromoSection } from '@/components/PromoSection';
import { HeroSection } from '@/components/HeroSection';


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
        const res = await axios.get("https://hansitha-web-storefront.onrender.com/api/products");
        setFeaturedProducts(res.data.slice(0, 8)); // top 8 featured
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
        const res = await axios.get("https://hansitha-web-storefront.onrender.com/api/carousel-images");
        const mapping = {
          carousel1: { image: "", heading: "", subtext: "" },
          carousel2: { image: "", heading: "", subtext: "" },
          carousel3: { image: "", heading: "", subtext: "" },
        };

        res.data.forEach((item) => {
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
      <PromoSection />
      <Footer />
    </div>
  );
};

export default Home;
