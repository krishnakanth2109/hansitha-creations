import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (user === null) return <p className="text-center mt-10">Loading...</p>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Details</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Hello, {user.name || 'User'} 👋
        </h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/orders')}
          className="w-full text-left bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium px-4 py-2 rounded-md transition"
        >
          📦 My Orders
        </button>
        <button
          onClick={() => navigate('/addresses')}
          className="w-full text-left bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded-md transition"
        >
          🏠 My Addresses
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left bg-red-100 hover:bg-red-200 text-red-800 font-medium px-4 py-2 rounded-md transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
