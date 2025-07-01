import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

const AddProduct = () => {
  const { products, setProducts, loading } = useProductContext();

  const [editing, setEditing] = useState<number | null>(null);

  const [newProductData, setNewProductData] = useState({
    name: '',
    price: '',
    image: '',
    rating: '',
    reviews: '',
    featured: false
  });

  const [editData, setEditData] = useState({
    name: '',
    price: '',
    image: '',
    rating: '',
    reviews: '',
    featured: false
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (mode === 'add') {
        setNewProductData((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        setEditData((prev) => ({ ...prev, image: data.secure_url }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleAdd = () => {
    const { name, price, image, rating, reviews, featured } = newProductData;

    if (!name || !price || !image || !rating || !reviews) {
      alert('Please fill all fields before adding a product.');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      image,
      rating: parseFloat(rating),
      reviews: parseInt(reviews),
      featured
    };

    setProducts((prev) => [...prev, newProduct]);
    setNewProductData({ name: '', price: '', image: '', rating: '', reviews: '', featured: false });
  };

  const handleEdit = (product: any) => {
    setEditing(product.id);
    setEditData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      featured: product.featured ?? false
    });
  };

  const handleUpdate = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editData.name,
              price: parseFloat(editData.price),
              image: editData.image,
              rating: parseFloat(editData.rating),
              reviews: parseInt(editData.reviews),
              featured: editData.featured
            }
          : p
      )
    );
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <div className="p-6 text-center">Loading products...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin - Manage Products</h1>

      {/* ➕ Add Product Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded w-full"
            value={newProductData.name}
            onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
          />
          <input
            placeholder="Price"
            className="border p-2 rounded w-full"
            value={newProductData.price}
            onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'add')}
            className="w-full"
          />
          <input
            placeholder="Rating"
            className="border p-2 rounded w-full"
            value={newProductData.rating}
            onChange={(e) => setNewProductData({ ...newProductData, rating: e.target.value })}
          />
          <input
            placeholder="Reviews"
            className="border p-2 rounded w-full"
            value={newProductData.reviews}
            onChange={(e) => setNewProductData({ ...newProductData, reviews: e.target.value })}
          />
          <label className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              checked={newProductData.featured}
              onChange={(e) =>
                setNewProductData({ ...newProductData, featured: e.target.checked })
              }
            />
            Featured
          </label>
        </div>
        {newProductData.image && (
          <img
            src={newProductData.image}
            alt="Preview"
            className="w-32 h-32 object-cover mt-4 border rounded"
          />
        )}
        <button
          onClick={handleAdd}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      {/* 🛠️ Product List */}
      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 rounded-lg p-4 flex justify-between items-start"
          >
            {editing === product.id ? (
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
                  className="border p-2 rounded"
                />
                <input
                  value={editData.reviews}
                  onChange={(e) => setEditData({ ...editData, reviews: e.target.value })}
                  placeholder="Reviews"
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
                <p>₹{Number(product.price).toFixed(2)}</p>
                <p>
                  Rating: {product.rating} ⭐️ ({product.reviews} reviews)
                </p>
                {product.featured && (
                  <p className="text-green-600 font-semibold">🌟 Featured Product</p>
                )}
                <img src={product.image} alt={product.name} className="w-32 mt-2" />
              </div>
            )}

            <div className="ml-4 flex flex-col gap-2">
              {editing === product.id ? (
                <button
                  onClick={() => handleUpdate(product.id)}
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
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProduct;
