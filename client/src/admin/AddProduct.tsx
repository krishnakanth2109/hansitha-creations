import React, { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['Fabrics', 'Accessories', 'Blouses', 'Sarees', 'Jewellery', 'Home Decor'];

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Fabrics',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'carousel_images'); // Make sure this preset exists in Cloudinary

    const res = await axios.post('https://api.cloudinary.com/v1_1/djyredhur/image/upload', formData);
    return res.data.secure_url;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const imageUrl = await uploadImage();
    const newProduct = {
      ...product,
      image: imageUrl,
      id: Date.now(), // unique ID
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      rating: 4.5,
      reviews: 0
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('products') || '[]');
    localStorage.setItem('products', JSON.stringify([...existing, newProduct]));

    alert('Product added successfully!');
    setProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Fabrics',
      image: '',
    });
    setImageFile(null);
  } catch (error) {
    alert('Error adding product');
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          value={product.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={product.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full p-2 border rounded"
          value={product.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="w-full p-2 border rounded"
          value={product.stock}
          onChange={handleInputChange}
          required
        />
        <select
          name="category"
          className="w-full p-2 border rounded"
          value={product.category}
          onChange={handleInputChange}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
