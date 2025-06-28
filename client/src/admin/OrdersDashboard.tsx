import React from 'react';

const dummyOrders = [
  {
    id: 'ORD123',
    name: 'Sai Ganesh',
    address: '123 Main St, Hyderabad',
    items: ['Kurta', 'Pant'],
    total: 3500
  },
];

const OrdersList = () => {
  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      {dummyOrders.map((order) => (
        <div key={order.id} className="border-b py-2">
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.name}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Items:</strong> {order.items.join(', ')}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
