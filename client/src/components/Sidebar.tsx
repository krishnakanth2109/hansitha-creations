import { useState } from 'react';
import { X, Search, Home, Store, Info, Phone, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const Sidebar = ({ isOpen, onClose, onLoginClick }: SidebarProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'fabrics'>('menu');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Store, label: 'Shop', href: '/shop' },
    { icon: Info, label: 'About Us', href: '/about' },
    { icon: Phone, label: 'Contact Us', href: '/contact' }
  ];

  const mainCategories = [
    { label: 'Fabrics', type: 'fabrics' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'CEO Collections', href: '/ceo-collections' },
  ];

  const fabrics = ['Cotton', 'Silk', 'Crape', 'Kota', 'Georgette', 'Tusser', 'Handlooms'];

  return (
    <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Hansitha Creations</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Search Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === 'menu'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === 'categories' || activeTab === 'fabrics'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Categories
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'menu' && (
          <div className="p-4 space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" />
                <span className="text-gray-800 group-hover:text-purple-600 font-medium">{item.label}</span>
              </a>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group w-full"
              >
                <User className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" />
                <span className="text-gray-800 group-hover:text-purple-600 font-medium">Login / Register</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-4 space-y-2 animate-fadeInRight">
            {mainCategories.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.type === 'fabrics') {
                    setActiveTab('fabrics');
                  } else {
                    navigate(item.href);
                    onClose();
                  }
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-800 hover:text-purple-600 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'fabrics' && (
          <div className="p-4 space-y-2 animate-fadeInRight">
            <button
              onClick={() => setActiveTab('categories')}
              className="flex items-center space-x-2 text-sm text-purple-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Categories</span>
            </button>
            {fabrics.map((fabric, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(`/fabrics/${fabric.toLowerCase()}`);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-800 hover:text-purple-600 font-medium"
              >
                {fabric}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
