
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navigationItems = [

    { title: 'Home', href: '/home' },
    {
      title: 'Fabrics',
      href: '/fabrics',
      dropdown: [
        {
          title: 'Men',
          href: '/fabrics/men',
          subdropdown: [
            { title: 'Shirts', href: '/fabrics/men/shirts' },
            { title: 'Pants', href: '/fabrics/men/pants' },
            { title: 'Shoes', href: '/fabrics/men/shoes' },
          ]
        },
        {
          title: 'Women',
          href: '/fabrics/women',
          subdropdown: [
            { title: 'Dresses', href: '/fabrics/women/dresses' },
            { title: 'Tops', href: '/fabrics/women/tops' },
            { title: 'Accessories', href: '/fabrics/women/accessories' },
          ]
        },
        { title: 'Kids', href: '/fabrics/kids' },
        { title: 'Sale', href: '/fabrics/sale' },
      ]
    },
    {
      title: 'New Arrivals',
      href: '/new-arrivals',
      dropdown: [
        { title: 'All Products', href: '/new-arrivals' },
        { title: 'Electronics', href: '/new-arrivals/electronics' },
        { title: 'Clothing', href: '/new-arrivals/clothing' },
        { title: 'Home & Garden', href: '/new-arrivals/home-garden' },
        { title: 'Fabrics', href: '/new-arrivals/fabrics' },
      ]
    },
    { title: 'Ceo Collections', href: '/ceocollections' },
  ];

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.title} className="relative group">
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>{item.title}</span>
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 transition-all duration-200 ${
                      activeDropdown === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.dropdown.map((dropdownItem) => (
                      <div key={dropdownItem.title} className="relative group/sub">
                        <Link
                          to={dropdownItem.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span>{dropdownItem.title}</span>
                            {'subdropdown' in dropdownItem && <ChevronDown className="w-3 h-3" />}
                          </div>
                        </Link>

                        {/* Sub-dropdown */}
                        {'subdropdown' in dropdownItem && (
                          <div className="absolute left-full top-0 bg-white shadow-lg rounded-lg py-2 w-40 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                            {dropdownItem.subdropdown.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/">
                        <img src="/src/assets/logo.png" className="flex h-48 w-30 mr-64" alt="Hansitha Logo" />
                      </Link>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Login</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            {navigationItems.map((item) => (
              <div key={item.title} className="mb-2">
                <button
                  onClick={() => handleDropdownToggle(item.title)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span>{item.title}</span>
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {item.dropdown && activeDropdown === item.title && (
                  <div className="bg-gray-50 py-2">
                    {item.dropdown.map((dropdownItem) => (
                      <div key={dropdownItem.title}>
                        <Link
                          to={dropdownItem.href}
                          className="block px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.title}
                        </Link>
                        {'subdropdown' in dropdownItem && (
                          <div className="bg-gray-100">
                            {dropdownItem.subdropdown.map((subItem) => (
                              <Link
                                key={subItem.title}
                                to={subItem.href}
                                className="block px-12 py-1 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
