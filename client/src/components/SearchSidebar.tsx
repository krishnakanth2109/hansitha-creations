// components/SearchSidebar.tsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSidebar = ({ isOpen, onClose }: SearchSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/search?q=${searchQuery}`
        );
        const data = await res.json();
        setSearchResults(data.slice(0, 5));
      } catch (err) {
        console.error('Search failed:', err);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full max-w-sm h-full bg-white shadow-2xl z-[999] p-4 border-r border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              onClose();
            }
          }}
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {searchResults.length > 0 && (
        <div className="mt-3 border border-gray-100 rounded-md shadow max-h-60 overflow-y-auto">
          {searchResults.map((product) => (
            <button
              key={product._id}
              onClick={() => {
                navigate(`/product/${product.name}`, { state: { product } });
                onClose();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
            >
              {product.name}
            </button>
          ))}
          <button
            onClick={() => {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
              onClose();
            }}
            className="w-full text-left px-4 py-2 border-t border-gray-100 text-purple-600 hover:bg-purple-50 font-medium"
          >
            View All Results
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default SearchSidebar;
