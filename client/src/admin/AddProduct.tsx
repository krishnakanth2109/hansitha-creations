import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { uploadImageToCloudinary } from '../components/cloudinary'; // Assuming you use Cloudinary

const AddProduct: React.FC = () => {
  const { setProducts } = useContext(ProductContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) return alert('Please upload an image');

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const newProduct = {
        name,
        price: Number(price),
        rating: Number(rating),
        reviews: Number(reviews),
        featured,
        image: imageUrl,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const savedProduct = await res.json();
      setProducts((prev: any) => [...prev, savedProduct]);

      // Reset form
      setName('');
      setPrice('');
      setRating('');
      setReviews('');
      setFeatured(false);
      setImageFile(null);
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Reviews"
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured Product
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
          className="w-full"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
