import React, { useState } from 'react';

const CarouselManager = () => {
  const [images, setImages] = useState<string[]>([
    // Load from DB or state
  ]);

  const handleAddImage = (url: string) => {
    setImages([...images, url]);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Carousel</h2>
      <input
        type="text"
        placeholder="Image URL"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddImage((e.target as HTMLInputElement).value);
        }}
        className="w-full border p-2 mb-2"
      />
      <div className="space-y-2">
        {images.map((img, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate w-4/5">{img}</span>
            <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;
