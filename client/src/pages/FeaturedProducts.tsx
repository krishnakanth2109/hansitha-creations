import React, { useContext, useRef } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, HeartIcon } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toastWithVoice } from "@/utils/toast";
import { motion } from "framer-motion";

const FeaturedProducts: React.FC = () => {
  const { products, loading } = useContext(ProductContext);
  const { formatPrice } = useCurrency();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const featured = Array.isArray(products)
    ? products.filter((product) => product.featured)
    : [];

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.name}`, { state: { product } });
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading)
    return <p className="p-4 text-center">Loading featured products...</p>;

  return (
    <div className="relative px-4 py-4 sm:px-6 sm:py-6">
      <h2 className="text-2xl text-center text-brandPink font-bold mb-6">
        FEATURED PRODUCTS
      </h2>

      {featured.length === 0 ? (
        <p className="text-center">No featured products found.</p>
      ) : (
        <div className="relative">
          {/* Scroll Buttons for Desktop */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Products Grid for Mobile, Horizontal Scroll for Desktop */}
          <div
            ref={scrollRef}
            className="grid grid-cols-2 gap-4 sm:flex sm:overflow-x-auto no-scrollbar sm:scroll-smooth"
          >
            {featured.map((product) => {
              const isWishlisted = isInWishlist(product._id);

              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="cursor-pointer group min-w-0 sm:min-w-[220px] max-w-[220px] flex-shrink-0"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-[364px]"
                    />

                    {/* Wishlist Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      animate={{ scale: isWishlisted ? 1.2 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!user) {
                          toastWithVoice.error(
                            "Please log in to add to wishlist",
                            { duration: 2000 }
                          );
                          return;
                        }
                        const added = await toggleWishlist(product._id);
                        toastWithVoice.success(
                          added ? "Added to wishlist" : "Removed from wishlist",
                          { duration: 2000 }
                        );
                      }}
                      className="absolute top-2 right-2 z-0 rounded-full p-1 text-white bg-black/50 hover:bg-black/70 transition"
                    >
                      {isWishlisted ? (
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>

                  <h3 className="text-base font-medium mt-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-lg font-semibold text-blue-100">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
