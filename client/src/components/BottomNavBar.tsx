import { Store, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavBarProps {
  onAccountClick: () => void;
}

const BottomNavBar = ({ onAccountClick }: BottomNavBarProps) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      icon: Store,
      label: 'Shop',
      href: '/shop',
      badge: 0,
      onClick: () => navigate('/shop'),
    },
    {
      icon: Heart,
      label: 'Wishlist',
      href: '/wishlist',
      badge: 5,
      onClick: () => navigate('/wishlist'),
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      href: '/cart',
      badge: cartCount,
      onClick: () => navigate('/cart'),
    },
    {
      icon: User,
      label: 'Account',
      href: '#',
      badge: 0,
      onClick: onAccountClick,
    },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg w-full">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
