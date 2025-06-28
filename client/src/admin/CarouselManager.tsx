import React, { useState } from 'react';

const CarouselManager = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCarousel, setSelectedCarousel] = useState('carousel1');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDropdownChange = (e) => {
    setSelectedCarousel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('carouselId', selectedCarousel);

    try {
      const response = await fetch('http://localhost:5000/api/upload-carousel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Image uploaded successfully!');
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image.');
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Manage Carousel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Select Carousel</label>
          <select
            value={selectedCarousel}
            onChange={handleDropdownChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="carousel1">Carousel 1</option>
            <option value="carousel2">Carousel 2</option>
            <option value="carousel3">Carousel 3</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarouselManager;
