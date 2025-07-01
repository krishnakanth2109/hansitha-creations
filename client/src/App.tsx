import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";

import Header from "./components/Header";

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

// Admin
import AdminPage from "./admin/AdminPage";

// React Query setup
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
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/*" element={<Shop />} />
                    <Route path="/categories/*" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/sso-callback" element={<SSORedirectHandler />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/account" element={<UserProfile />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/featured" element={<FeaturedProducts />} />

                    {/* Static pages */}
                    <Route
                      path="/about"
                      element={
                        <div className="min-h-screen flex items-center justify-center">
                          <h1 className="text-4xl font-bold">About Page</h1>
                        </div>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <div className="min-h-screen flex items-center justify-center">
                          <h1 className="text-4xl font-bold">Contact Page</h1>
                        </div>
                      }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </ProductProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
