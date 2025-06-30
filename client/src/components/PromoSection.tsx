
import React from 'react';
import { Button } from '@/components/ui/button';

export const PromoSection = () => {
  const promoCards = [
    {
      title: "Smart Deals",
      subtitle: "Trending Smartphones",
      description: "Exchange Offer Available",
      price: "From ₹6,299",
      buttonText: "Shop Now",
      bgColor: "from-green-400 to-green-500",
      icon: "📱"
    },
    {
      title: "Best Deals On Fashion",
      subtitle: "Min 50% Off",
      description: "Latest Collection",
      price: "",
      buttonText: "Shop Now",
      bgColor: "from-blue-400 to-blue-500",
      icon: "👗"
    },
    {
      title: "Cold Drinks & Snacks",
      subtitle: "UP TO 33% OFF",
      description: "Summer Essentials",
      price: "",
      buttonText: "Shop Now",
      bgColor: "from-orange-400 to-red-500",
      icon: "🥤"
    },
    {
      title: "Exciting Deal on iPhone 15",
      subtitle: "From ₹57,990*",
      description: "Limited Period Offer",
      price: "",
      buttonText: "Shop Now",
      bgColor: "from-green-500 to-teal-500",
      icon: "📱"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {promoCards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.bgColor} p-6 text-white min-h-[280px] flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90 mb-1">{card.subtitle}</p>
                <p className="text-xs opacity-80 mb-4">{card.description}</p>
                {card.price && (
                  <p className="text-2xl font-bold mb-4">{card.price}</p>
                )}
              </div>
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full backdrop-blur-sm"
              >
                {card.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'For all Orders Over 1000' },
            { icon: '💳', title: 'Secured Payment', desc: 'Payment Cards Accepted' },
            { icon: '🎁', title: 'Special Gifts', desc: 'Our First Product Order' },
            { icon: '🎧', title: 'Support 24/7', desc: 'Contact us Anytime' }
          ].map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
