import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { ProfileHeader } from "@/components/ProfileHeader";
import { QuickActions } from "@/components/QuickActions";
import { RecentOrders } from "@/components/RecentOrders";
import { SecuritySettings } from "@/components/SecuritySettings";

export default function Account() {
  const [activeSection, setActiveSection] = useState<string>("default");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return; // still loading
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (user === null) return <p className="text-center mt-10">Authenticating...</p>;

  const handleActionClick = (action: string) => {
    setActiveSection(action);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderMainContent = () => {
    if (activeSection === "orders") {
      return <div className="grid grid-cols-1 gap-6"><RecentOrders /></div>;
    }

    if (activeSection === "settings") {
      return <div className="grid grid-cols-1 gap-6"><SecuritySettings /></div>;
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        <QuickActions onActionClick={handleActionClick} userName={user.name} />
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-subtle">
        <main className="container mx-auto px-4 py-6 space-y-6 pb-20 md:pb-6">
          <ProfileHeader user={user} onLogout={handleLogout} />
          {renderMainContent()}
        </main>
      </div>
    </Layout>
  );
}
