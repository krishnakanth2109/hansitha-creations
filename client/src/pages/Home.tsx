import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { featuredProducts } from '../data/products';


const Home = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

const [carouselSlides, setCarouselSlides] = React.useState([
  { image: "", heading: "", subtext: "" }, // placeholder for carousel1
  { image: "", heading: "", subtext: "" }, // placeholder for carousel2
  { image: "", heading: "", subtext: "" }  // placeholder for carousel3
]);

React.useEffect(() => {
  const fetchCarouselImages = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/carousel-images");
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


const [currentSlide, setCurrentSlide] = React.useState(0);

React.useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  }, 2500); // 2.5 seconds
  return () => clearInterval(interval);
}, []);

const handlePrev = () => {
  setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
};

const handleNext = () => {
  setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
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
        index === currentSlide
          ? 'opacity-100 z-10'
          : 'opacity-0 z-0'
      }`}
    />
  ))}

  {/* Overlay Text */}
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

  {/* Navigation Arrows */}
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




      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
  key={product.id}
  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-fit"
>

                <div className="relative overflow-hidden">
  <img
    src={product.image}
    alt={product.name}
    className="object-contain hover:scale-105 transition-transform duration-300"
    style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
  />
</div>

                <div className="p-4 w-full">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
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
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Show Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
