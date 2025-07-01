import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Slide {
    heading: string;
    subtext: string;
    buttonText: string;
    imageUrl: string;
    buttonLink: string;
}

export const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<Slide[]>([]);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await axios.get('https://hansitha-web-storefront.onrender.com/api/carousel-images');
                const parsedSlides = res.data.map((item: any) => ({
                    heading: item.heading || 'Welcome to our store!',
                    subtext: item.subtext || 'Check out the latest collections.',
                    buttonText: item.buttonText || 'Shop Now',
                    imageUrl: item.imageUrl || '', // required
                    buttonLink: item.buttonLink || '/shop'
                }));
                setSlides(parsedSlides);
            } catch (err) {
                console.error('Failed to fetch carousel data', err);
            }
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (slides.length === 0) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <p className="text-black-500 text-lg">Banners are Loading...</p>
            </div>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className="relative overflow-hidden">
            {/* Background image with overlay */}
            <div className="relative min-h-[500px] md:min-h-[600px]">

                <div className="absolute inset-0 min-h-[500px] md:min-h-[600px] bg-gradient-to-r from-blue-300 to-pink-300 flex items-center transition-all duration-1000"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-20 flex items-center min-h-[500px]">
                    <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                        <div className="space-y-6 text-black">
                            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                                EXCLUSIVE OFFER - 40% OFF
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{slide.heading}</h1>

                            <p className="text-lg md:text-xl opacity-90">{slide.subtext}</p>

                            {/* ✅ Button block separated so it gets spacing too */}
                            <div>
                                <Link to={slide.buttonLink}>
                                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                        {slide.buttonText} →
                                    </Button>
                                </Link>
                            </div>
                        </div>


                        <div className="relative w-full h-80 md:h-96 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 overflow-hidden group">
                            <img
                                src={slide.imageUrl}
                                alt="Featured Product"
                                className="w-full h-full object-cover rounded-3xl transition-transform duration-500 md:group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-pink-500 scale-125' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
