import { Menu, ShoppingCart, Heart, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import SearchSidebar from "./SearchSidebar";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur-sm border-b border-gray-200">
        <div className="w-full h-16 max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left: Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="flex justify-center">
            <img
              src="https://res.cloudinary.com/djyredhur/image/upload/v1751127717/logo_ktewtc.png"
              alt="Hansitha Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Right: Icons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>

            {/* Wishlist */}
            <div className="relative">
              <button
                onClick={() => navigate("/wishlist")}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <Heart className="w-6 h-6 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => navigate("/cart")}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Always Visible Account Icon */}
          <div className="md:hidden">
            <button
              onClick={() => navigate(user ? "/account" : "/login")}
              className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Search Sidebar (still functional on mobile if triggered elsewhere) */}
        <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>
    </>
  );
};

export default Header;
