import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toastWithVoice } from "@/utils/toast";
import { Heart, HeartIcon, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import SearchSidebar from "../components/SearchSidebar";
import { Footer } from "../components/Footer";
import BottomNavBar from "../components/BottomNavBar";
import { useSwipeable } from "react-swipeable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetailsPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const { products } = useContext(ProductContext);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      document
        .getElementById("related-scroll")
        ?.scrollBy({ left: 250, behavior: "smooth" }),
    onSwipedRight: () =>
      document
        .getElementById("related-scroll")
        ?.scrollBy({ left: -250, behavior: "smooth" }),
    trackMouse: true,
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (location.state?.product) {
        setProduct(location.state.product);
        return;
      }
      if (!name) return;
      setProduct(null);
      try {
        const decodedName = decodeURIComponent(name);
        const res = await axios.get(
          `${API_URL}/api/products?name=${decodedName}`
        );
        if (res.data.length > 0) setProduct(res.data[0]);
        else {
          toastWithVoice.error("Product not found", { duration: 2000 });
          navigate("/");
        }
      } catch (err) {
        toastWithVoice.error("Error loading product", { duration: 2000 });
        navigate("/");
      }
    };
    loadProduct();
  }, [name, location.state]);

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
      setSelectedColor(product.color || "Terracotta");
    }
  }, [product]);

  const allImages = product
    ? [...new Set([product.image, ...(product.extraImages || [])])]
    : [];

  const handleNextImage = () => {
    const i = allImages.indexOf(selectedImage);
    setSelectedImage(allImages[(i + 1) % allImages.length]);
  };

  const handlePrevImage = () => {
    const i = allImages.indexOf(selectedImage);
    setSelectedImage(allImages[(i - 1 + allImages.length) % allImages.length]);
  };

  useEffect(() => {
    if (!autoScroll || allImages.length <= 1) return;
    const interval = setInterval(handleNextImage, 3000);
    return () => clearInterval(interval);
  }, [autoScroll, allImages, selectedImage]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    toastWithVoice.success("Added to cart!", { duration: 2000 });
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toastWithVoice.error("Login to use wishlist", { duration: 2000 });
      navigate("/login");
      return;
    }
    try {
      const wasInWishlist = isInWishlist(product._id);
      await toggleWishlist(product._id);
      toastWithVoice.success(
        `${wasInWishlist ? "Removed from" : "Added to"} wishlist`,
        { duration: 2000 }
      );
    } catch {
      toastWithVoice.error("Error updating wishlist", { duration: 2000 });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toastWithVoice.success("Product shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toastWithVoice.success("Link copied to clipboard!");
      }
    } catch (error) {
      toastWithVoice.error("Unable to share.");
    }
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  const related = products.filter(
    (p) => p.category === product.category && p._id !== product._id
  );

  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <>
      {isSearchOpen && (
        <>
          <SearchSidebar
            isOpen={isSearchOpen}
            onClose={() => setSearchOpen(false)}
          />
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSearchOpen(false)}
          />
        </>
      )}

      <div className="p-6 pb-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="relative">
              <img
                src={selectedImage}
                onMouseEnter={() => setAutoScroll(false)}
                onMouseLeave={() => setAutoScroll(true)}
                className="w-160 h-80 mx-auto object-cover rounded-lg shadow-lg"
                alt={product.name}
              />
            </div>

            <div className="flex gap-2 mt-4 justify-center">
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex gap-2">
              {product.featured && (
                <Badge variant="outline">Featured Product</Badge>
              )}
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-black-500 text-sm mb-4">{product.description}</p>
            <div className="flex items-center justify-start mb-2">
              <p className="text-2xl font-bold text-blue-100">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <span
                className={`text-xl ml-10 font-medium ${
                  product.stock > 0 ? "text-white" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `Stock : ${product.stock}`
                  : "Out of Stock"}
              </span>
            </div>
            {lowStock && (
              <p className="text-red-500 text-sm mb-2">
                Hurry! Only {product.stock} left in stock.
              </p>
            )}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border bg-white rounded-lg"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="px-3 py-1 border bg-white rounded-lg"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-2 border bg-white rounded-lg ${
                  isInWishlist(product._id) ? "text-red-600" : ""
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist(product._id) ? "fill-red-600" : ""
                  }`}
                />
              </button>

              <Button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                variant="outline"
                size="lg"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator className="my-6" />

            <Tabs
              defaultValue="description"
              className="w-full bg-white rounded-lg shadow-lg p-4"
            >
              <TabsList className="grid w-full bg-pink-200 grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="sizing">Size Guide</TabsTrigger>
                <TabsTrigger value="care">Care</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold text-boutique-warm">
                    Product Features
                  </h4>
                  <ul className="space-y-2 text-bl">
                    <li>• Premium sustainable cotton blend fabric</li>
                    <li>• Hand-embroidered detailing</li>
                    <li>• Flowing midi length silhouette</li>
                    <li>• Comfortable fit with subtle stretch</li>
                    <li>• Ethically made by skilled artisans</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="sizing" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold text-boutique-warm">
                    Size Chart
                  </h4>
                  <p className="text-black">All measurements in inches.</p>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="font-semibold">Size</div>
                    <div className="font-semibold">Bust</div>
                    <div className="font-semibold">Waist</div>
                    <div className="font-semibold">Hip</div>
                    <div>XS</div>
                    <div>32-34</div>
                    <div>26-28</div>
                    <div>36-38</div>
                    <div>S</div>
                    <div>34-36</div>
                    <div>28-30</div>
                    <div>38-40</div>
                    <div>M</div>
                    <div>36-38</div>
                    <div>30-32</div>
                    <div>40-42</div>
                    <div>L</div>
                    <div>38-40</div>
                    <div>32-34</div>
                    <div>42-44</div>
                    <div>XL</div>
                    <div>40-42</div>
                    <div>34-36</div>
                    <div>44-46</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="care" className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold text-boutique-warm">
                    Care Instructions
                  </h4>
                  <ul className="space-y-2 text-black">
                    <li>• Machine wash cold with like colors</li>
                    <li>• Use gentle cycle and mild detergent</li>
                    <li>• Hang dry or tumble dry on low heat</li>
                    <li>• Iron on medium heat if needed</li>
                    <li>• Store hanging to maintain shape</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Related Products</h2>
            <div
              className="flex gap-4 overflow-x-auto scrollbar-hide -mx-1 px-1"
              {...swipeHandlers}
              id="related-scroll"
            >
              {related.map((item) => (
                <div
                  key={item._id}
                  className="relative min-w-[200px] text-left p-3 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  {/* Wishlist Heart */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: isInWishlist(item._id) ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!user) {
                        toastWithVoice.error(
                          "Please log in to add to wishlist",
                          { duration: 2000 }
                        );
                        return;
                      }
                      const added = await toggleWishlist(item._id);
                      toastWithVoice.success(
                        added ? "Added to wishlist" : "Removed from wishlist",
                        { duration: 2000 }
                      );
                    }}
                    className="absolute top-2 right-2 z-10 rounded-full p-1 text-white bg-black/50 hover:bg-black/70 transition"
                  >
                    {isInWishlist(item._id) ? (
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </motion.button>

                  <button
                    onClick={() =>
                      navigate(`/product/${encodeURIComponent(item.name)}`, {
                        state: { product: item },
                      })
                    }
                    className="text-left"
                  >
                    <img
                      src={item.image}
                      className="w-[180px] h-[300px] object-cover rounded"
                      alt={item.name}
                    />
                    <h3 className="mt-2 font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-blue-600 font-bold">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <div className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden">
        <BottomNavBar
          onSearchClick={() => setSearchOpen(true)}
          onAccountClick={() => navigate("/account")}
        />
      </div>
    </>
  );
};

export default ProductDetailsPage;
