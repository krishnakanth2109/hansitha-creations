import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Category = {
  _id: string;
  name: string;
  image: string;
};

const CategoryCircle = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories'); // proxy to your Express server
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (categoryName: string) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10 px-4 sm:px-8 py-8">
      {(loading ? Array(6).fill(null) : categories).map((cat, index) => (
        <div
          key={cat?._id || index}
          className="flex flex-col items-center cursor-pointer w-32 sm:w-40"
          onClick={() => cat && handleClick(cat.name)}
        >
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-gray-300 shadow hover:scale-105 transition-transform bg-gray-100">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-300 rounded-full" />
            ) : (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="mt-3 text-base sm:text-lg font-medium text-center">
            {loading ? (
              <div className="w-20 h-4 bg-gray-300 animate-pulse rounded" />
            ) : (
              cat.name
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryCircle;
