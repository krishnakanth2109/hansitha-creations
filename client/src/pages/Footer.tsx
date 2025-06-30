import React from 'react';
import {
    Facebook,
    Instagram,
    Twitter,
    MessageCircleMore,
    Youtube, // WhatsApp
} from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src="https://res.cloudinary.com/djyredhur/image/upload/v1751127717/logo_ktewtc.png"
                                alt="FashionHub Logo"
                                className="h-16 w-auto ml-10"
                            />
                        </div>

                        <p className="text-gray-400 mb-4">
                            Your premier destination for women's fashion. Discover the latest trends in dresses, sarees, and accessories.
                        </p>
                        <div className="flex space-x-3">
                            <a
                                href="https://www.facebook.com/kiranmai.sarees"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/hansitha_creations_9/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6 bg-gray-800 hover:bg-[radial-gradient(circle_at_30%_107%,_#fdf497_0%,_#fd5949_45%,_#d6249f_60%,_#285AEB_90%)]"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>

                            <a
                                href="https://www.youtube.com/@kiranmaisarees3089"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                            >
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-green-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                            >
                                <MessageCircleMore className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold mb-4">Products</h4>
                        <ul className="space-y-2 text-gray-400">
                            {['Dresses', 'Sarees', 'Accessories', 'Footwear', 'Bags', 'Jewelry'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-pink-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Our Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            {['About Us', 'Careers', 'Press', 'Blog', 'Affiliate Program', 'Partnership'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-pink-400 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-4">Subscribe to Newsletter</h4>
                        <p className="text-gray-400 mb-4">Get the latest updates on new products and upcoming sales</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-r-lg hover:from-pink-600 hover:to-purple-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 FashionHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
