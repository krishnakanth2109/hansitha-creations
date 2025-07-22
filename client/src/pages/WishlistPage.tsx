import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { ProductContext } from '@/context/ProductContext';
import { useCurrency } from '@/context/CurrencyContext';

const WishlistPage: React.FC = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { products, loading } = useContext(ProductContext);
    const { formatPrice } = useCurrency();
    const navigate = useNavigate();

    const wishlistProducts = Array.isArray(products)
        ? products.filter((p) => wishlist.includes(p._id))
        : [];

    if (loading) {
        return <p className="text-center py-10 text-lg">Loading wishlist...</p>;
    }

    if (wishlist.length === 0 || wishlistProducts?.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-lg text-gray-500">Your wishlist is empty 💔</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 pb-24"> {/* 👈 Added `pb-24` */}
            <h2 className="text-2xl font-bold mb-6 text-center text-brandPink">Your Wishlist</h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {wishlistProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product._id);
                    return (
                        <div
                            key={product._id}
                            onClick={() => navigate(`/product/${product.name}`, { state: { product } })}
                            className="cursor-pointer group"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-md">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-[834px] h-[364px]"
                                />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWishlist(product._id);
                                    }}
                                    className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow-md transition-transform duration-150 active:scale-125 text-red-500 text-lg"
                                    title="Remove from wishlist"
                                >
                                    💔
                                </button>
                            </div>

                            <h3 className="text-base font-medium mt-2 truncate">{product.name}</h3>
                            <div className="flex gap-2 items-center mt-1">
                                <span className="text-lg font-semibold text-black">
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WishlistPage;
