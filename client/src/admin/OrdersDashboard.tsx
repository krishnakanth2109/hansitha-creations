import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  email: string;
  address: string;
  cartItems: CartItem[];
  totalAmount: number;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = io(API_URL, {
      withCredentials: true,
    });

    socket.on('newOrder', () => {
      toast.success('🛒 New order received!');
      fetchOrders(); // Refresh orders only
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border-b py-4 space-y-2">
            <p><strong>ID:</strong> {order._id}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Address:</strong> {order.address}</p>

            <div>
              <strong>Cart Items:</strong>
              <ul className="pl-4 mt-2 space-y-2">
                {order.cartItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersList;
