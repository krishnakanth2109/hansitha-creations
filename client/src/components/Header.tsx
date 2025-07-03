import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser, SignOutButton } from '@clerk/clerk-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const totalItems = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const navigationItems = [
    
    { title: 'Home', href: '/' },
    {
      title: 'Fabrics',
      href: '/fabrics',
      dropdown: [
        {
          title: 'Cotton',
          href: '/fabrics/Cotton',
          subdropdown: [
            { title: 'Mul Cotton', href: '/fabrics/cotton/mul-cotton' },
          { title: '1 Inch Cotton', href: '/fabrics/cotton/1-inch' },
          { title: '2 Inch Cotton', href: '/fabrics/cotton/2-inch' },
          { title: 'Kadhi Cotton', href: '/fabrics/cotton/kadhi' },
          { title: 'Chanderi Cotton', href: '/fabrics/cotton/chanderi' }
          ]
        },
        {
          title: 'Silk',
        href: '/fabrics/silk',
        subdropdown: [
          { title: 'Chanderi Silk', href: '/fabrics/silk/chanderi' },
          { title: 'Chenoru Silk', href: '/fabrics/silk/chenoru' },
          { title: 'Soft Silk', href: '/fabrics/silk/soft' },
          { title: 'Tabu Silk', href: '/fabrics/silk/tabu' }
          ]
        },
        {
        title: 'Crape',
        href: '/fabrics/crape',
        subdropdown: [
          { title: 'Jute Crape', href: '/fabrics/crape/jute' },
          { title: 'Soft Jute Crape', href: '/fabrics/crape/soft-jute' },
          { title: 'Lenin Crape', href: '/fabrics/crape/lenin' },
          { title: 'Net Crape', href: '/fabrics/crape/net' },
          { title: 'Crape Checks', href: '/fabrics/crape/checks' },
          { title: 'Jute Checks', href: '/fabrics/crape/jute-checks' },
          { title: 'Banaras Crape', href: '/fabrics/crape/banaras' },
          { title: 'Banaras Booties', href: '/fabrics/crape/booties' },
          { title: 'Banaras 1 inch Border Crape', href: '/fabrics/crape/1-inch-border' },
          { title: 'Jute Crape Double Shade', href: '/fabrics/crape/double-shade' },
          { title: 'Munga Banaras', href: '/fabrics/crape/munga-banaras' },
          { title: 'Satin Crape', href: '/fabrics/crape/satin' },
          { title: 'Shimmer Crape', href: '/fabrics/crape/shimmer' },
          { title: 'Chanderi Crape', href: '/fabrics/crape/chanderi' }
        ]
      },
        {
        title: 'Kota',
        href: '/fabrics/kota',
        subdropdown: [
          { title: 'Tissue Kota', href: '/fabrics/kota/tissue' },
          { title: 'Silk Mix Kota', href: '/fabrics/kota/silk-mix' },
          { title: 'Cotton Mix Kota', href: '/fabrics/kota/cotton-mix' },
          { title: 'Cotton Zari Kota', href: '/fabrics/kota/cotton-zari' },
          { title: 'Cotton Pencil Kota', href: '/fabrics/kota/pencil' },
          { title: 'Cotton 1 1/2 inch Kota', href: '/fabrics/kota/1-half-inch' },
          { title: 'Kota Checks', href: '/fabrics/kota/checks' },
          { title: 'Moonga Kota', href: '/fabrics/kota/moonga' },
          { title: 'Supernet Kota', href: '/fabrics/kota/supernet' },
          { title: 'Pure Silk Kota', href: '/fabrics/kota/pure-silk' }
        ]
      },

       {
        title: 'Georgette',
        href: '/fabrics/georgette',
        subdropdown: [
          { title: 'Banaras Georgette', href: '/fabrics/georgette/banaras' },
          { title: 'Georgette with Digital', href: '/fabrics/georgette/digital' },
          { title: 'Cotton with Digital', href: '/fabrics/georgette/cotton-digital' },
          { title: 'Mul.Mul with Digital', href: '/fabrics/georgette/mulmul-digital' },
          { title: 'Shimmer Crape with Digital', href: '/fabrics/georgette/shimmer-digital' }
        ]
      },
      {
        title: 'Tusser',
        href: '/fabrics/tusser',
        subdropdown: [
          { title: 'Semi Tusser', href: '/fabrics/tusser/semi' },
          { title: 'Jute Tusser', href: '/fabrics/tusser/jute' },
          { title: 'Falling Tusser', href: '/fabrics/tusser/falling' }
        ]
      },
      {
        title: 'Handlooms',
        href: '/fabrics/handlooms',
        subdropdown: [
          { title: 'Kalamkari with Handlooms', href: '/fabrics/handlooms/kalamkari' },
          { title: 'Pondur Khadi', href: '/fabrics/handlooms/pondur-khadi' },
          { title: 'Mangalgiri Handlooms', href: '/fabrics/handlooms/mangalgiri' }
        ]
      },
      
      ]
    },
    {
      title: 'New Arrivals',
      href: '/new-arrivals',
    },
    { title: 'CEO Collections', href: '/collections' },
  ];

  const handleDropdownToggle = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setIsMobileMenuOpen(false);
    setShowAccountDropdown(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setShowAccountDropdown(false);
    setShowMobileSearch(false);
  };

  const toggleAccountDropdown = () => {
    setShowAccountDropdown((prev) => !prev);
    setIsMobileMenuOpen(false);
    setShowMobileSearch(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setShowAccountDropdown(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 text-sm">
        Get up to 50% off new season styles - Limited time only!
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {showMobileSearch && (
            <div className="md:hidden px-4 py-2 w-full">
              <div className="flex items-center border rounded-full px-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-2 py-1 text-sm focus:outline-none"
                />
                <button onClick={handleSearch}>
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.title} className="relative group">
                <Link
                  to={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>{item.title}</span>
                  {item.dropdown && <ChevronDown className="w-4 h-4" />}
                </Link>
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 transition-all duration-200 ${activeDropdown === item.title ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
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
                        {'subdropdown' in dropdownItem && (
                          <div className="absolute left-full top-0 bg-white shadow-lg rounded-lg py-2 min-w-[300px] grid grid-cols-2 gap-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
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

          <Link to="/" className="flex justify-center mx-auto">
            <img src="https://res.cloudinary.com/djyredhur/image/upload/v1751127717/logo_ktewtc.png" alt="Hansitha Logo" className="h-16 w-auto mx-auto" />
          </Link>

          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border border-gray-300 rounded-full px-4 py-1 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-4 md:ml-4">
            {!showMobileSearch && (
              <>
                {isSignedIn ? (
                  <div className="relative" ref={accountRef}>
                    <button
                      onClick={toggleAccountDropdown}
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline">Account</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div
                      className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg transform transition-all duration-200 origin-top-right z-50 ${showAccountDropdown
                        ? 'scale-100 opacity-100 visible'
                        : 'scale-95 opacity-0 invisible'
                        }`}
                    >
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowAccountDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/UserOrders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setShowAccountDropdown(false)}
                      >
                        Orders
                      </Link>
                      <SignOutButton>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          Signout
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                )}

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
              </>
            )}
            <button onClick={toggleMobileSearch} className="md:hidden text-gray-700 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={toggleMobileMenu} className="md:hidden text-gray-700 hover:text-blue-600 transition-colors">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div ref={sidebarRef} className="md:hidden bg-white border-t border-gray-200 py-4">
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
