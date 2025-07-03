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
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-12 py-10">
      {promos.map((promo, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-3xl p-6 md:p-10"
          style={{ backgroundColor: promo.bgColor }}
        >
          <div>
            <p className="text-black font-bold text-xl md:text-2xl mb-2">{promo.subtitle}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">{promo.title}</h2>
            <p className="text-black mb-4">{promo.description}</p>
            <button className="bg-black text-white px-5 py-2 rounded-lg hover:bg-violet-500 transition">
              SHOP NOW
            </button>
          </div>
          <img
            src={promo.image}
            alt={promo.title}
            className="hidden md:block w-44 h-auto object-contain"
          />
        </div>
      ))}
    </section>
  );
};
