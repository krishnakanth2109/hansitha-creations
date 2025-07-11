import { Menu, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        {/* Left: Hamburger */}
        <button
          onClick={onMenuClick}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Center: Logo from Cloudinary */}
        <Link to="/" className="flex justify-center mx-auto">
            <img
              src="https://res.cloudinary.com/djyredhur/image/upload/v1751127717/logo_ktewtc.png"
              alt="Hansitha Logo"
              className="h-16 w-auto mx-auto"
            />
          </Link>

        {/* Right: Cart */}
        <div className="relative">
          <button
            onClick={() => navigate('/cart')}
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
    </header>
  );
};

export default Header;
