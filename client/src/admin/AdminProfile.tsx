import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    navigate('/');
  };

  const handleSwitchToUserView = () => {
    navigate('/account');
  };

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.patch(
        `${API_URL}/api/users/update-role`,
        { email, role: newRole },
        { withCredentials: true }
      );
      setMessage(`✅ ${res.data.message}`);
    } catch (error: any) {
      setMessage(`❌ ${error.response?.data?.message || 'Error updating role'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>
      <p><strong>Name:</strong> Hansitha Creations Admin</p>
      <p><strong>Email:</strong> admin@gmail.com</p>
      <p><strong>Role:</strong> Admin</p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleSwitchToUserView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to User View
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Role Change Form */}
      <form onSubmit={handleRoleChange} className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Change User Role</h3>
        <input
          type="email"
          required
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? 'Updating...' : 'Update Role'}
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AdminProfile;
