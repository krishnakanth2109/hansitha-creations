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
import NotFound from "./pages/NotFound";
import SSORedirectHandler from "./pages/SSORedirectHandler";
import SearchResults from "./pages/SearchResults";
import FeaturedProducts from "./pages/FeaturedProducts";
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminCategoryPanel from '../src/admin/AdminCategoryPanel';
import CategoryCircle from './components/CategoryCircle';

// Admin
import AdminPage from "./admin/AdminPage";
// import { i } from "node_modules/@clerk/clerk-react/dist/useAuth-CbDfW7Rs.d.mts";

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
                <Route path="/product/:name" element={<ProductDetailsPage key={location.pathname} />} />
                <Route path="/" element={<CategoryCircle />} />
                <Route path="/admin/categories" element={<AdminCategoryPanel />} />

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
