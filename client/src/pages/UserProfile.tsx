import React, { useEffect, useState } from 'react';
import {
  useUser,
  UserButton,
  UserProfile as ClerkUserProfile,
  RedirectToUserProfile,
} from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const UserProfile = () => {
  const { user, isSignedIn } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [showSecurity, setShowSecurity] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
    };

    fetchOrders();
  }, [user]);

  if (!isSignedIn)
    return <div className="text-center py-8">Please sign in to view your profile.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header with User Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">My Profile</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Clerk Profile (Editable) */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-4 mb-8">
        <button
          onClick={() => setShowSecurity(!showSecurity)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
        >
          {showSecurity ? 'Hide' : 'Manage'} Security Settings
        </button>

        {showSecurity && (
          <div className="border-t pt-4">
            {/* Embedded Clerk security/profile section */}
            <ClerkUserProfile />
          </div>
        )}
      </div>

      {/* Supabase Orders */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h2>
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <li key={order.id} className="py-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between flex-wrap gap-y-1">
                  <span>Order #{order.id}</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: ₹{order.total_amount} | Status: {order.status}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
