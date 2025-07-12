import React, { useEffect, useState } from 'react';

type Category = {
  _id: string;
  name: string;
  image: string;
};

const CategoryCircle = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
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
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `http://localhost:8080/fabrics/${slug}`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10 px-4 sm:px-8 py-8">
      {(loading ? Array(6).fill(null) : categories).map((cat, index) => (
        <div
          key={cat?._id || index}
          className="flex flex-col items-center cursor-pointer w-24 sm:w-32"
          onClick={() => cat && handleClick(cat.name)}
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300 shadow hover:scale-105 transition-transform bg-gray-100">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-300 rounded-full" />
            ) : (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')
                }
              />
            )}
          </div>
          <span className="mt-2 text-sm sm:text-base font-medium text-center">
            {loading ? (
              <div className="w-16 h-4 bg-gray-300 animate-pulse rounded" />
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
