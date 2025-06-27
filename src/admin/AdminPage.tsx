import React, { useState } from 'react';
import AddProduct from './AddProduct';
import CarouselManager from './CarouselManager';
import OrdersDashboard from './OrdersDashboard';
import AdminProfile from './AdminProfile';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('add');

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
      <div className="w-64 bg-blue-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
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

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
