import React, { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { uploadImageToCloudinary } from '../components/cloudinary';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const categoryOptions = [
  'Cotton',
  'Silk',
  'Crape',
  'Kota',
  'Georgette',
  'Tusser',
  'Handlooms',
  'New Arrivals',
  'CEO Collections',
];

const AddProduct: React.FC = () => {
  const { products, setProducts } = useContext(ProductContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error('Failed to fetch products');
        console.error('Fetch error:', err);
      }
    };
    fetchProducts();
  }, [setProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);
      let imageUrl = '';

      if (!editingId && !imageFile) {
        toast.error('Please upload an image');
        return;
      }

      if (!category) {
        toast.error('Please select a category');
        return;
      }

      if (!description.trim()) {
        toast.error('Please enter a product description');
        return;
      }

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const productData = {
        name,
        price: Number(price),
        stock: Number(stock),
        featured,
        category,
        description,
        ...(imageUrl && { image: imageUrl }),
      };

      if (editingId) {
        const res = await fetch(`${API_URL}/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });

        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();

        setProducts((prev: any) =>
          prev.map((p: any) => (p._id === editingId ? updated : p))
        );
        toast.success('Product updated!');
        setEditingId(null);
      } else {
        console.log('Sending data to backend:', { ...productData, image: imageUrl });
        const res = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...productData, image: imageUrl }),
        });

        if (!res.ok) throw new Error('Add failed');
        const savedProduct = await res.json();

        setProducts((prev: any) => [...prev, savedProduct]);
        toast.success('Product added!');
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setFeatured(false);
    setCategory('');
    setDescription('');
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock?.toString() || '');
    setFeatured(product.featured);
    setCategory(product.category || '');
    setDescription(product.description || '');
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setProducts((prev: any) => prev.filter((p: any) => p._id !== id));
      toast.success('Product deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h2>
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
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border p-2 rounded min-h-[100px]"
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
          className="w-full"
        />
        {imageFile && (
          <div className="mt-4">
            <p className="text-sm mb-2">Image Preview:</p>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-48 h-48 object-cover rounded border"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Existing Products</h3>
        {products.map((product: any) => {
          const isEditing = editingId === product._id;

          return (
            <div
              key={product._id}
              className="border p-4 rounded mb-4 flex items-start gap-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                {isEditing ? (
                  <p className="text-gray-500">Editing this product above ↑</p>
                ) : (
                  <>
                    <h4 className="font-bold">{product.name}</h4>
                    <p>₹{product.price.toLocaleString('en-IN')}</p>
                    <p>Stock: {product.stock}</p>
                    <p>Category: {product.category}</p>
                    <p>{product.featured ? '🌟 Featured' : ''}</p>
                    <p>Description: {product.description}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddProduct;
