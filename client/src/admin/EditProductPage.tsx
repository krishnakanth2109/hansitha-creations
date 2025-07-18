import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useProductContext } from '../context/ProductContext';
import { uploadImageToCloudinary } from '../components/cloudinary';
import { productTypes, categoryOptions } from './ProductManagementPage';

const API_URL = import.meta.env.VITE_API_URL;

interface EditProductPageProps {
  productId: string | null;
  onBack: () => void;
}

const EditProductPage: React.FC<EditProductPageProps> = ({ productId, onBack }) => {
  const { products, reloadProducts } = useProductContext();
  const [product, setProduct] = useState<any>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newExtraImages, setNewExtraImages] = useState<File[]>([]);

  useEffect(() => {
    const p = products.find(p => p._id === productId);
    if (p) setProduct(p);
  }, [productId, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = async () => {
    if (newImageFile) {
      const url = await uploadImageToCloudinary(newImageFile);
      setProduct({ ...product, image: url });
      toast.success("Main image updated!");
    }
  };

  const handleExtraImagesUpload = async () => {
    const uploadedUrls = await Promise.all(
      newExtraImages.map(file => uploadImageToCloudinary(file))
    );
    setProduct({ ...product, extraImages: [...(product.extraImages || []), ...uploadedUrls] });
    toast.success("Extra images added!");
  };

  const handleExtraImageDelete = (index: number) => {
    const updated = product.extraImages.filter((_: string, i: number) => i !== index);
    setProduct({ ...product, extraImages: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/products/${productId}`, product);
      toast.success('Product updated successfully');
      reloadProducts();
      onBack();
    } catch {
      toast.error('Failed to update product');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="text-blue-500 hover:underline">&larr; Back</button>
        <h2 className="text-2xl font-bold ml-4">Edit Product</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {['name', 'price', 'stock'].map(field => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 capitalize">{field}</label>
            <input
              type={field === 'price' || field === 'stock' ? 'number' : 'text'}
              name={field}
              value={product[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {categoryOptions.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Product Type</label>
          <select
            name="type"
            value={product.type || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            {productTypes.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Current Image</label>
          <img src={product.image} alt="Product" className="w-32 h-32 object-cover rounded my-2" />
          <input type="file" onChange={(e) => setNewImageFile(e.target.files?.[0] || null)} />
          <button
            type="button"
            onClick={handleImageUpload}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
          >
            Upload New Image
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Extra Images</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.extraImages?.map((img: string, i: number) => (
              <div key={i} className="relative">
                <img src={img} alt={`extra-${i}`} className="w-20 h-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => handleExtraImageDelete(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => setNewExtraImages(Array.from(e.target.files || []))}
          />
          <button
            type="button"
            onClick={handleExtraImagesUpload}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
          >
            Upload Extra Images
          </button>
        </div>

        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
