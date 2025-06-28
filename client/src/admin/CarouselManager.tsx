import React, { useEffect, useState } from 'react';

const CarouselManager = () => {
  const [selectedCarousel, setSelectedCarousel] = useState('carousel1');
  const [selectedFile, setSelectedFile] = useState(null);
  const [heading, setHeading] = useState('');
  const [subtext, setSubtext] = useState('');
  const [carouselData, setCarouselData] = useState([]);

  // Fetch existing carousels
  const fetchCarousels = async () => {
    const res = await fetch('http://localhost:5000/api/carousel-images');
    const data = await res.json();
    setCarouselData(data);
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  // Upload image or text
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('carouselId', selectedCarousel);
    if (selectedFile) formData.append('image', selectedFile);
    if (heading) formData.append('heading', heading);
    if (subtext) formData.append('subtext', subtext);

    const res = await fetch('http://localhost:5000/api/upload-carousel', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      alert('Uploaded!');
      setSelectedFile(null);
      setHeading('');
      setSubtext('');
      fetchCarousels();
    } else {
      alert('Upload failed: ' + data.message);
    }
  };

  // Delete a carousel
  const handleDelete = async (carouselId) => {
    if (!window.confirm(`Delete ${carouselId}?`)) return;
    const res = await fetch(`http://localhost:5000/api/delete-carousel/${carouselId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.ok) {
      alert('Deleted!');
      fetchCarousels();
    } else {
      alert('Delete failed: ' + data.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-8">
      <h2 className="text-2xl font-bold">Carousel Manager</h2>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4 border-b pb-6">
        <div>
          <label>Select Carousel</label>
          <select
            value={selectedCarousel}
            onChange={(e) => setSelectedCarousel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="carousel1">Carousel 1</option>
            <option value="carousel2">Carousel 2</option>
            <option value="carousel3">Carousel 3</option>
          </select>
        </div>

        <div>
  <label className="block font-semibold mb-1">Upload Image</label>
  <div className="flex items-center gap-4 mb-2">
    <input
      id="imageInput"
      type="file"
      accept="image/*"
      onChange={(e) => setSelectedFile(e.target.files[0])}
      className="flex-1"
    />
    {selectedFile && (
      <button
        type="button"
        onClick={() => {
          setSelectedFile(null);
          const input = document.getElementById('imageInput') as HTMLInputElement;
if (input) input.value = '';
        }}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>
    )}
  </div>

  {selectedFile && (
    <img
      src={URL.createObjectURL(selectedFile)}
      alt="Preview"
      className="w-full object-contain rounded border max-h-[500px]"
    />
  )}
</div>




        <div>
          <label>Heading</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Subtext</label>
          <input
            type="text"
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>

      {/* Preview Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Carousels</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {carouselData.map((item) => (
            <div key={item.carouselId} className="border rounded p-4 shadow">
              {item.imageUrl && (
                <img src={item.imageUrl} alt="Carousel" className="w-full h-40 object-cover mb-2 rounded" />
              )}
              <h4 className="font-bold">{item.heading || "No Heading"}</h4>
              <p className="text-gray-600">{item.subtext || "No Subtext"}</p>
              <p className="text-sm text-gray-400 mt-2">{item.carouselId}</p>
              <button
                onClick={() => handleDelete(item.carouselId)}
                className="mt-3 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselManager;
