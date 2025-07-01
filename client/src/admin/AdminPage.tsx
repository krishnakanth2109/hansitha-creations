import React, { useState } from 'react';
import AddProduct from './AddProduct';
import CarouselManager from './CarouselManager';
import OrdersDashboard from './OrdersDashboard';
import AdminProfile from './AdminProfile';
import { Menu } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom'; 

const AdminPage = () => {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('add');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Wait for Clerk to load user
  if (!isLoaded) {
    return (
  <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading...</div>
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
      case 'orders':
        return <OrdersDashboard />;
      case 'profile':
        return <AdminProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} bg-blue-800 text-white overflow-hidden`}>
        <div className="p-6 space-y-4">
          <Link to="/admin" className="text-2xl font-bold mb-6 hover:text-pink-400 transition-colors">
  Admin Panel
</Link>
          <button onClick={() => setActiveTab('add')} className="block w-full text-left hover:bg-blue-700 p-2 rounded">
            Add Products
          </button>
          <button onClick={() => setActiveTab('carousel')} className="block w-full text-left hover:bg-blue-700 p-2 rounded">
            Carousel Images
          </button>
          <button onClick={() => setActiveTab('orders')} className="block w-full text-left hover:bg-blue-700 p-2 rounded">
            Orders Dashboard
          </button>
          <button onClick={() => setActiveTab('profile')} className="block w-full text-left hover:bg-blue-700 p-2 rounded">
            Admin Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 relative">
        {/* Toggle Button */}
        <div className="p-4">
          <button
            className="bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* Actual Content */}
        <div className="p-8 pt-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;