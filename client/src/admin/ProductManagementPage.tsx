// ✅ Full Updated ProductManagementPage.tsx with:
// - CSV Export
// - Bulk Publish/Unpublish
// - Bulk Upload via CSV (with main & extra images)

import React, { useState } from 'react';
import { useProductContext } from '../context/ProductContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Papa from 'papaparse';

const API_URL = import.meta.env.VITE_API_URL;

interface ProductManagementPageProps {
  onEdit: (productId: string) => void;
}
export const productTypes = ['Featured Products', 'CEO Collections', 'New Arrivals'];
export const categoryOptions = ['Silk', 'Cotton', 'Crape', 'Kota'];

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ onEdit }) => {
  const { products, loading, reloadProducts } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/products/${productId}`);
      toast.success('Product deleted');
      reloadProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm('Delete selected products?')) return;
    try {
      await Promise.all(selectedProducts.map(id => axios.delete(`${API_URL}/api/products/${id}`)));
      toast.success('Selected products deleted');
      setSelectedProducts([]);
      reloadProducts();
    } catch {
      toast.error('Bulk delete failed');
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    try {
      await Promise.all(
        selectedProducts.map(id =>
          axios.put(`${API_URL}/api/products/${id}`, { published })
        )
      );
      toast.success(`Products ${published ? 'published' : 'unpublished'}`);
      setSelectedProducts([]);
      reloadProducts();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleCSVExport = () => {
    const csv = Papa.unparse(products.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      description: p.description,
      image: p.image,
      extraImages: p.extraImages?.join(',') || '',
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          await Promise.all(
            rows.map(async (row) => {
              const product = {
                name: row.name,
                category: row.category,
                price: Number(row.price),
                stock: Number(row.stock),
                description: row.description,
                image: row.image,
                extraImages: row.extraImages?.split(',') || [],
              };
              await axios.post(`${API_URL}/api/products`, product);
            })
          );
          toast.success('Bulk upload complete');
          reloadProducts();
        } catch {
          toast.error('Bulk upload failed');
        }
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search for a product..."
          className="w-full sm:w-64 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={handleCSVExport} className="bg-green-600 text-white px-3 py-2 rounded">
          Export CSV
        </button>

        <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded">
          Upload CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} hidden />
        </label>

        <button
          onClick={() => handleBulkPublish(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded disabled:opacity-50"
          disabled={selectedProducts.length === 0}
        >
          Publish Selected
        </button>
        <button
          onClick={() => handleBulkPublish(false)}
          className="bg-yellow-500 text-white px-3 py-2 rounded disabled:opacity-50"
          disabled={selectedProducts.length === 0}
        >
          Unpublish Selected
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-600 text-white px-3 py-2 rounded disabled:opacity-50"
          disabled={selectedProducts.length === 0}
        >
          Delete Selected ({selectedProducts.length})
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => toggleSelectProduct(product._id)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => onEdit(product._id)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;
