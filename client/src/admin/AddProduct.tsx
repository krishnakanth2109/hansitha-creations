import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

const AddProduct = () => {
  const { products, setProducts, loading } = useContext(ProductContext);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [newProductData, setNewProductData] = useState({
    name: '',
    price: '',
    image: '',
    rating: '',
    reviews: '',
    featured: false,
  });

  const [editData, setEditData] = useState({
    name: '',
    price: '',
    image: '',
    rating: '',
    reviews: '',
    featured: false,
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: 'add' | 'edit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setImageUploading(true);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.secure_url;

      if (mode === 'add') {
        setNewProductData((prev) => ({ ...prev, image: imageUrl }));
      } else {
        setEditData((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleAdd = async () => {
    const { name, price, image, rating, reviews, featured } = newProductData;

    if (!name || !price || !image || !rating || !reviews) {
      alert('Please fill all fields.');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedRating = parseFloat(rating);
    const parsedReviews = parseInt(reviews);

    if (isNaN(parsedPrice) || isNaN(parsedRating) || isNaN(parsedReviews)) {
      alert('Price, Rating, and Reviews must be valid numbers.');
      return;
    }

    const payload = {
      name,
      price: parsedPrice,
      image,
      rating: parsedRating,
      reviews: parsedReviews,
      featured,
    };

    try {
      setAdding(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Add failed');
      const created = await res.json();

      setProducts((prev) => [...prev, created]);
      setNewProductData({ name: '', price: '', image: '', rating: '', reviews: '', featured: false });
    } catch (err) {
      console.error(err);
      alert('Error adding product.');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (product: any) => {
  setEditingId(product._id);
  setEditData({
    name: product.name,
    price: product.price.toString(),
    image: product.image,
    rating: (product.rating ?? '').toString(),
    reviews: (product.reviews ?? '').toString(),
    featured: product.featured ?? false,
  });
};


  const handleUpdate = async (id: string) => {
    const updated = {
      name: editData.name,
      price: parseFloat(editData.price),
      image: editData.image,
      rating: parseFloat(editData.rating),
      reviews: parseInt(editData.reviews),
      featured: editData.featured,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Update failed');
      const updatedProduct = await res.json();

      setProducts((prev) => prev.map((p) => (p._id === id ? updatedProduct : p)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Error updating product.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting product.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading products...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin - Manage Products</h1>

      {/* Add Product Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded"
            value={newProductData.name}
            onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
            required
          />
          <input
            placeholder="Price"
            className="border p-2 rounded"
            type="number"
            value={newProductData.price}
            onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'add')}
            className="w-full"
          />
          <input
            placeholder="Rating"
            type="number"
            step="0.1"
            className="border p-2 rounded"
            value={newProductData.rating}
            onChange={(e) => setNewProductData({ ...newProductData, rating: e.target.value })}
            required
          />
          <input
            placeholder="Reviews"
            type="number"
            className="border p-2 rounded"
            value={newProductData.reviews}
            onChange={(e) => setNewProductData({ ...newProductData, reviews: e.target.value })}
            required
          />
          <label className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              checked={newProductData.featured}
              onChange={(e) => setNewProductData({ ...newProductData, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>
        {newProductData.image && (
          <img src={newProductData.image} alt="Preview" className="w-32 h-32 mt-2 rounded border" />
        )}
        <button
          onClick={handleAdd}
          disabled={adding || imageUploading}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {adding ? 'Adding...' : 'Add Product'}
        </button>
      </div>

      {/* Product List */}
      <div className="grid gap-4">
        {products.map((product) =>
          !product._id ? null : (
            <div
              key={product._id}
              className="bg-gray-100 rounded-lg p-4 flex justify-between items-start"
            >
              {editingId === product._id ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Name"
                    className="border p-2 rounded"
                  />
                  <input
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    placeholder="Price"
                    type="number"
                    className="border p-2 rounded"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'edit')}
                  />
                  <input
                    value={editData.rating}
                    onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                    placeholder="Rating"
                    type="number"
                    className="border p-2 rounded"
                  />
                  <input
                    value={editData.reviews}
                    onChange={(e) => setEditData({ ...editData, reviews: e.target.value })}
                    placeholder="Reviews"
                    type="number"
                    className="border p-2 rounded"
                  />
                  <label className="flex items-center gap-2 col-span-2">
                    <input
                      type="checkbox"
                      checked={editData.featured}
                      onChange={(e) =>
                        setEditData({ ...editData, featured: e.target.checked })
                      }
                    />
                    Featured
                  </label>
                  {editData.image && (
                    <img
                      src={editData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover mt-2 border rounded"
                    />
                  )}
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p>₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  <p>
                    Rating: ⭐ {product.rating} ({product.reviews} reviews)
                  </p>
                  {product.featured && (
                    <p className="text-green-600 font-semibold">🌟 Featured Product</p>
                  )}
                  <img src={product.image} alt={product.name} className="w-32 mt-2" />
                </div>
              )}

              <div className="ml-4 flex flex-col gap-2">
                {editingId === product._id ? (
                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddProduct;
