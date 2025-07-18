import React, { useState } from 'react';
import AddProduct from './AddProduct';
import CarouselManager from './CarouselManager';
import OrdersDashboard from './OrdersDashboard';
import AdminProfile from './AdminProfile';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditProductPage from './EditProductPage';
import AdminCategoryPanel from './AdminCategoryPanel';
import ProductManagementPage from './ProductManagementPage';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddProduct />;
      case 'edit':
        return (
          <EditProductPage
            productId={editingProductId}
            onBack={() => setActiveTab('manage')}
          />
        );
      case 'manage':
        return (
          <ProductManagementPage
            onEdit={(id) => {
              setEditingProductId(id);
              setActiveTab('edit'); // Ensure it navigates to Edit tab
            }}
          />
        );
      case 'carousel':
        return <CarouselManager />;
      case 'circle':
        return <AdminCategoryPanel />;
      case 'orders':
        return <OrdersDashboard />;
      case 'profile':
        return <AdminProfile />;
      default:
        return null;
    }
  };

  const SidebarLinks = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin" className="text-2xl font-bold hover:text-pink-400">
          Admin Panel
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="text-2xl text-blue-800"
        >
          <X />
        </button>
      </div>

      {[
        ['add', 'Add Products'],
        ['edit', 'Edit Products'],
        ['manage', 'Manage Products'],
        ['carousel', 'Carousel Images'],
        ['circle', 'Category Circle'],
        ['orders', 'Orders Dashboard'],
        ['profile', 'Admin Profile'],
      ].map(([key, label]) => (
        <button
          key={key}
          onClick={() => {
            setActiveTab(key);
            setEditingProductId(null); // reset editing ID
            setIsMobileSidebarOpen(false);
          }}
          className="block w-full text-left hover:bg-blue-700 p-2 rounded"
        >
          {label}
        </button>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      {isDesktopSidebarVisible && (
        <div className="hidden sm:block w-64 bg-blue-800 text-white p-6">
          <SidebarLinks />
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-white z-50 p-6 sm:hidden">
          <nav className="space-y-4 text-black">
            <SidebarLinks />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4">
          <button
            className="sm:hidden bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu />
          </button>

          <button
            className="hidden sm:inline-flex bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setIsDesktopSidebarVisible(!isDesktopSidebarVisible)}
          >
            {isDesktopSidebarVisible ? <X /> : <Menu />}
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-8 pt-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
