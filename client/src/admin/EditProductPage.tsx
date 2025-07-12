// src/pages/admin/EditProductPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/products/${id}`, product);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={product.name} onChange={handleChange} />
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" value={product.category} onChange={handleChange} />
        </div>
        <div>
          <Label>Price</Label>
          <Input name="price" type="number" value={product.price} onChange={handleChange} />
        </div>
        <div>
          <Label>Original Price</Label>
          <Input name="originalPrice" type="number" value={product.originalPrice} onChange={handleChange} />
        </div>
        <div>
          <Label>Discount</Label>
          <Input name="discount" type="number" value={product.discount} onChange={handleChange} />
        </div>
        <div>
          <Label>Rating</Label>
          <Input name="rating" type="number" value={product.rating} onChange={handleChange} />
        </div>
        <div>
          <Label>Reviews</Label>
          <Input name="reviews" type="number" value={product.reviews} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={product.description} onChange={handleChange} rows={5} />
      </div>

      <div className="flex justify-between">
        <Button onClick={() => navigate('/admin/products')} variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default EditProductPage;
