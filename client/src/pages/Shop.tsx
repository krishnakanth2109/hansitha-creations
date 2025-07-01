import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const Shop: React.FC = () => {
  const { products, loading } = useContext(ProductContext);

if (loading) return <p>Loading...</p>;
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border rounded-xl shadow p-4">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
        </div>
      ))}
    </div>
  );
};

export default Shop;
