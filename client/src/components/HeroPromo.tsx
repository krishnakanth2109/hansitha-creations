import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const HeroPromo = () => {
  const [promos, setPromos] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/hero-promos`)
      .then(res => setPromos(res.data))
      .catch(err => console.error('Failed to load promos:', err));
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 md:px-12 py-10">
      {promos.map((promo, i) => (
        <div
          key={i}
          className="relative rounded-3xl p-6 md:p-10 overflow-hidden min-h-[200px]"
          style={{ backgroundColor: promo.bgColor }}
        >
          {/* Image container */}
          <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-4 w-24 md:w-40 h-auto">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-auto object-contain rounded-full"
            />
          </div>

          {/* Text Content */}
          <div className="pr-28 md:pr-0">
            <p className="text-white font-bold text-lg md:text-xl mb-1">{promo.subtitle}</p>
            <h2 className="text-xl md:text-2xl font-bold text-black mb-2">{promo.title}</h2>
            <p className="text-black mb-4 break-words">{promo.description}</p>
            <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-violet-500 transition">
              SHOP NOW
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
