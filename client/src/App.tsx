import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Layout from "./components/Layout"; // ✅ NEW

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/SignIn";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import SSORedirectHandler from "./pages/SSORedirectHandler";
import SearchResults from "./pages/SearchResults";
import FeaturedProducts from "./pages/FeaturedProducts";
import CategoryPage from './pages/CategoryPage';
import ProductDetails from "./components/ProductDetails";

// Admin
import AdminPage from "./admin/AdminPage";
import { i } from "node_modules/@clerk/clerk-react/dist/useAuth-CbDfW7Rs.d.mts";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <ProductProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes with Layout */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Layout>
                      <Shop />
                    </Layout>
                  }
                />
                <Route
                  path="/shop/*"
                  element={
                    <Layout>
                      <Shop />
                    </Layout>
                  }
                />
                <Route
                  path="/categories/*"
                  element={
                    <Layout>
                      <Shop />
                    </Layout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Layout>
                      <Cart />
                    </Layout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <Layout>
                      <Checkout />
                    </Layout>
                  }
                />
                <Route
                  path="/order-confirmation"
                  element={
                    <Layout>
                      <OrderConfirmation />
                    </Layout>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <Layout>
                      <UserProfile />
                    </Layout>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <Layout>
                      <SearchResults />
                    </Layout>
                  }
                />
                <Route
                  path="/featured"
                  element={
                    <Layout>
                      <FeaturedProducts />
                    </Layout>
                  }
                />
                <Route
                  path="/fabrics/:category"
                  element={
                    <Layout>
                      <CategoryPage />
                    </Layout>
                  }
                />

                {/* Static Pages */}
                <Route
                  path="/about"
                  element={
                    <Layout>
                      <div className="min-h-screen flex items-center justify-center">
                        <h1 className="text-4xl font-bold">About Page</h1>
                      </div>
                    </Layout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Layout>
                      <div className="min-h-screen flex items-center justify-center">
                        <h1 className="text-4xl font-bold">Contact Page</h1>
                      </div>
                    </Layout>
                  }
                />
                <Route path="/product/:productName" element={<ProductDetails />} />

                {/* Auth Pages (without layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login/sso-callback" element={<SSORedirectHandler />} />

                {/* Admin (you can wrap in Layout if needed) */}
                <Route path="/admin" element={<AdminPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ProductProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
