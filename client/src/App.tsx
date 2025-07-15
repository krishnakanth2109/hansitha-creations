import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage from './pages/WishlistPage';

import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import SSORedirectHandler from "./pages/SSORedirectHandler";
import SearchResults from "./pages/SearchResults";
import FeaturedProducts from "./pages/FeaturedProducts";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Checkout from "./pages/Checkout";

// Admin
import AdminPage from "./admin/AdminPage";
import AdminCategoryPanel from "./admin/AdminCategoryPanel";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/shop" element={<Layout><Shop /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />
      <Route path="/search" element={<Layout><SearchResults /></Layout>} />
      <Route path="/featured" element={<Layout><FeaturedProducts /></Layout>} />
      <Route path="/fabrics/:category" element={<Layout><CategoryPage /></Layout>} />
      <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/about" element={<Layout><div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">About Page</h1></div></Layout>} />
      <Route path="/contact" element={<Layout><div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">Contact Page</h1></div></Layout>} />
      <Route path="/product/:name" element={<ProductDetailsPage key={location.pathname} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/fabrics/:categoryName" element={<AdminCategoryPanel />} />

      {/* SSO Handler */}
      <Route path="/login/sso-callback" element={<SSORedirectHandler />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} /> 
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <ProductProvider>
            <WishlistProvider>
              <BrowserRouter>
                <CurrencyProvider>
                  <Toaster />
                  <Sonner />
                  <AppRoutes />
                </CurrencyProvider>
              </BrowserRouter>
            </WishlistProvider>
          </ProductProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
