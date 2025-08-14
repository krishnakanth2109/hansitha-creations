// src/pages/Account.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { ProfileHeader } from "@/components/ProfileHeader";
import { QuickActions } from "@/components/QuickActions";
import { RecentOrders } from "@/components/RecentOrders";
import { SecuritySettings } from "@/components/SecuritySettings";
import { Footer } from "@/components/Footer";

export default function Account() {
  const [activeSection, setActiveSection] = useState<string>("default");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleActionClick = (action: string) => {
    // This is where the navigation logic lives
    if (action === "addresses") {
      navigate("/address"); // Navigate to the address page route
    } else {
      setActiveSection(action);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "orders":
        return <RecentOrders />;
      case "settings":
        return <SecuritySettings />;
      default:
        return <QuickActions onActionClick={handleActionClick} userName={user.name} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-pink-400">
        <main className="container mx-auto px-4 py-6 space-y-6">
          <ProfileHeader user={user} onLogout={handleLogout} />
          <div className="grid grid-cols-1 gap-6">{renderMainContent()}</div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}