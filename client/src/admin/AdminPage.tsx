import React, { useState } from 'react';
import AddProduct from './AddProduct';
import CarouselManager from './CarouselManager';
import OrdersDashboard from './OrdersDashboard';
import AdminProfile from './AdminProfile';
import { Menu, X } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import AdminPromoEditor from '../components/AdminPromoEditor';

const AdminPage = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('add');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        You Don't Have Access for This Page.
      </div>
    );
  }

  const role = user?.publicMetadata?.role;
  if (!role) return <div>No role set</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddProduct />;
      case 'carousel':
        return <CarouselManager />;
        case 'promo':
      return <AdminPromoEditor />;
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
      {/* Top: Admin Panel + Close (X) */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/admin"
          className="text-2xl font-bold hover:text-pink-400"
        >
          Admin Panel
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="text-2xl text-blue-800"
        >
          <X />
        </button>
      </div>

      {/* Sidebar buttons */}
      <button
        onClick={() => { setActiveTab('add'); setIsMobileSidebarOpen(false); }}
        className="block w-full text-left hover:bg-blue-700 p-2 rounded"
      >
        Add Products
      </button>
      <button
        onClick={() => { setActiveTab('carousel'); setIsMobileSidebarOpen(false); }}
        className="block w-full text-left hover:bg-blue-700 p-2 rounded"
      >
        Carousel Images
      </button>
      <button
        onClick={() => { setActiveTab('promo'); setIsMobileSidebarOpen(false); }}
        className="block w-full text-left hover:bg-blue-700 p-2 rounded"
      >
        Promo Editor
      </button>
      <button
        onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
        className="block w-full text-left hover:bg-blue-700 p-2 rounded"
      >
        Orders Dashboard
      </button>
      <button
        onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}
        className="block w-full text-left hover:bg-blue-700 p-2 rounded"
      >
        Admin Profile
      </button>
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

      {/* Mobile Sidebar (Drawer) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-white z-50 p-6 sm:hidden">
          <div className="flex justify-between items-center mb-6">

          </div>
          <nav className="space-y-4 text-black">
            <SidebarLinks />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Top bar with toggle buttons */}
        <div className="flex items-center justify-between p-4">
          {/* Mobile toggle */}
          <button
            className="sm:hidden bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu />
          </button>

          {/* Desktop toggle */}
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
