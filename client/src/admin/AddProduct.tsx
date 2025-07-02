import React, { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { uploadImageToCloudinary } from '../components/cloudinary';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const AddProduct: React.FC = () => {
  const { products, setProducts } = useContext(ProductContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState('');
  const [featured, setFeatured] = useState(false);
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

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const productData = {
        name,
        price: Number(price),
        rating: Number(rating),
        reviews: Number(reviews),
        featured,
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

      setName('');
      setPrice('');
      setRating('');
      setReviews('');
      setFeatured(false);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price.toString());
    setRating(product.rating.toString());
    setReviews(product.reviews.toString());
    setFeatured(product.featured);
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
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border p-2 mb-2 rounded"
                    />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border p-2 mb-2 rounded"
                    />
                    <input
                      type="number"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full border p-2 mb-2 rounded"
                    />
                    <input
                      type="number"
                      value={reviews}
                      onChange={(e) => setReviews(e.target.value)}
                      className="w-full border p-2 mb-2 rounded"
                    />
                    <label className="flex items-center gap-2 mb-2">
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
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setEditingId(null);
                          setName('');
                          setPrice('');
                          setRating('');
                          setReviews('');
                          setFeatured(false);
                          setImageFile(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold">{product.name}</h4>
                    <p>₹{product.price.toLocaleString('en-IN')}</p>
                    <p>Rating: {product.rating} ⭐ ({product.reviews} reviews)</p>
                    <p>{product.featured ? '🌟 Featured' : ''}</p>
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
