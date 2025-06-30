import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Footer } from '../pages/footer'; // adjust the path as needed


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
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black bg-opacity-40 z-20 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {carouselSlides[currentSlide].heading}
          </h1>
          <p className="text-lg md:text-2xl opacity-90 max-w-2xl">
            {carouselSlides[currentSlide].subtext}
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors z-30"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 transition"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 transition"
        >
          ›
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
