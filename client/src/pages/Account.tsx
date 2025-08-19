import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Cleaned up imports
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { ProfileHeader } from "@/components/ProfileHeader";
import { QuickActions } from "@/components/QuickActions";
import { RecentOrders } from "@/components/RecentOrders";
import { SecuritySettings } from "@/components/SecuritySettings";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button"; // Added the missing Button import

export default function Account() {
  const [activeSection, setActiveSection] = useState<string>("default");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Effect to redirect if the user is not logged in
  useEffect(() => {
    if (!loading && user === null) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  // Show a loading message while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  // Don't render anything if there's no user
  if (!user) {
    return null;
  }

  // Function to handle clicks on quick action buttons
  const handleActionClick = (action: string) => {
    if (action === "addresses") {
      navigate("/address"); // Navigate to the separate address page
    } else {
      // For other actions, just switch the section shown on this page
      setActiveSection(action);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Renders the main content section based on the active state
  const renderMainContent = () => {
    switch (activeSection) {
      case "orders":
        return <RecentOrders />;
      case "settings":
        return <SecuritySettings />;
      default:
        // Default view is the Quick Actions grid
        return <QuickActions onActionClick={handleActionClick} userName={user.name} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-pink-400">
        <main className="container mx-auto px-4 py-6 space-y-6">
          <ProfileHeader user={user} onLogout={handleLogout} />

          {/* Conditionally render the "Go to Admin Panel" button */}
          {user.role === 'admin' && (
            <div className="flex justify-center my-4">
              <Link to="/admin">
                <Button 
                  size="lg" 
                  className="bg-purple-600 text-white hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                  Go to Admin Panel
                </Button>
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {renderMainContent()}
          </div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
}