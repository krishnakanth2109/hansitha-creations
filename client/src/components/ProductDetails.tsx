
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  discount: number;
  images: string[];
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (productId: number, quantity: number) => void;
  allProducts: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductDetails = ({ product, onBack, onAddToCart, allProducts, onProductSelect }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toast } = useToast();

  // Get related products by category
  const relatedProducts = allProducts.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % product.images.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [product.images.length]);

  // Handle scroll to show/hide bottom navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowBottomNav(false);
      } else {
        // Scrolling up
        setShowBottomNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  const handleRelatedProductClick = (relatedProduct: Product) => {
    onProductSelect(relatedProduct);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg group cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="aspect-square relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        }
                      : {}
                  }
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleWishlist}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                {product.images.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 basis-1/4">
                    <button
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-square ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-purple-500' 
                          : 'hover:ring-2 hover:ring-gray-300'
                      } transition-all`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="hover:text-purple-600 cursor-pointer">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="hover:text-purple-600 cursor-pointer">{product.category}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-800 font-medium">{product.name}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-red-500">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                {product.discount}% OFF
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart - ₹{product.price * quantity}</span>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Free Delivery</span>
                <span className="font-medium">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Return Policy</span>
                <span className="font-medium">30 days</span>
              </div>
              <div className="flex justify-between">
                <span>Cash on Delivery</span>
                <span className="font-medium">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => handleRelatedProductClick(relatedProduct)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 overflow-hidden cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {relatedProduct.discount}% OFF
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{relatedProduct.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">({relatedProduct.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-500">₹{relatedProduct.price}</span>
                      <span className="text-sm text-gray-400 line-through">₹{relatedProduct.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Bottom Navigation for Product Details */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 transition-transform duration-300 ${
        showBottomNav ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-xs font-medium">Back</span>
          </button>

          <div className="flex items-center space-x-2 flex-1 justify-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 mx-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs">₹{product.price * quantity}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default ProductDetails;
