import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import toast from 'react-hot-toast';

type Promo = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  bgColor: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPromoEditor = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState('#fde2e2');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/hero-promos`);
      setPromos(res.data);
    } catch (err: any) {
      toast.error('Failed to load promos');
      console.error('Fetch Error:', err?.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBgColor('#fde2e2');
    setImage(null);
    setImagePreview(null);
    setSelectedPromo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('bgColor', bgColor);
    if (image) formData.append('image', image);

    try {
      if (selectedPromo) {
        await axios.put(`${BASE_URL}/api/hero-promos/${selectedPromo._id}`, formData);
        toast.success('Promo updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/hero-promos`, formData);
        toast.success('Promo added successfully');
      }
      resetForm();
      await fetchPromos();
    } catch (err: any) {
      toast.error('Failed to save promo');
      console.error('Submit Error:', err?.response?.data || err.message);
    }
  };

  const handleEdit = (promo: Promo) => {
    setTitle(promo.title);
    setSubtitle(promo.subtitle);
    setDescription(promo.description);
    setBgColor(promo.bgColor);
    setImage(null);
    setImagePreview(promo.image);
    setSelectedPromo(promo);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this promo?');
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/hero-promos/${id}`);
      toast.success('Promo deleted successfully');
      await fetchPromos();
    } catch (err: any) {
      toast.error('Failed to delete promo');
      console.error('Delete Error:', err?.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4 mb-10">
        <h2 className="font-bold text-xl">{selectedPromo ? 'Edit Promo' : 'Add New Promo'}</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="w-full border px-4 py-2 rounded"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label className="block font-medium mb-1">Background Color</label>
          <ChromePicker
            color={bgColor}
            onChangeComplete={(color) => setBgColor(color.hex)}
          />
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImage(file || null);
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result as string);
                reader.readAsDataURL(file);
              } else {
                setImagePreview(null);
              }
            }}
          />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="h-12 object-contain" />
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {selectedPromo ? 'Update Promo' : 'Add Promo'}
          </button>
          {selectedPromo && (
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Promo List */}
      <div className="space-y-4">
        {promos.map((promo) => (
          <div
            key={promo._id}
            className="p-4 rounded shadow flex justify-between items-start"
            style={{ backgroundColor: promo.bgColor }}
          >
            <div>
              <h2 className="text-lg font-bold">{promo.title}</h2>
              <p>{promo.subtitle}</p>
              <p className="text-sm text-gray-600">{promo.description}</p>
              {promo.image && (
                <img src={promo.image} alt={promo.title} className="mt-2 h-12 object-contain" />
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(promo)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(promo._id)}
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

export default AdminPromoEditor;
