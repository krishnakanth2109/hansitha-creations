import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // States for login
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Forgot password flow
  const [stage, setStage] = useState<'login' | 'forgot' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(formData);
    if (result.success) {
      navigate('/account', { replace: true });
    } else {
      setError(result.message);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/request-otp`, { email });
      toast.success(data.message || "OTP sent to email");
      setStage('verify');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp,
        password: newPassword,
      });
      toast.success(data.message || "Password reset successful");
      setStage('login');
      setFormData({ email, password: '' }); // prefill email after reset
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP or error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        {stage === 'login' && 'Sign In'}
        {stage === 'forgot' && 'Forgot Password'}
        {stage === 'verify' && 'Verify OTP & Reset'}
      </h2>

      {error && stage === 'login' && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      {stage === 'login' && (
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="Enter your email"
              required
              className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              placeholder="Enter your password"
              required
              className="w-full py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700"
          >
            Sign In
          </button>
        </form>
      )}

      {/* Forgot Password Form */}
      {stage === 'forgot' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Send OTP
          </button>
          <button
            type="button"
            className="text-sm text-gray-500 mt-2 hover:underline"
            onClick={() => setStage('login')}
          >
            Back to Login
          </button>
        </form>
      )}

      {/* Verify OTP and Reset Password */}
      {stage === 'verify' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-3 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
            Reset Password
          </button>
          <button
            type="button"
            className="text-sm text-gray-500 mt-2 hover:underline"
            onClick={() => setStage('login')}
          >
            Back to Login
          </button>
        </form>
      )}

      {/* Bottom Navigation */}
      {stage === 'login' && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-purple-600 hover:underline font-medium">
              Register
            </a>
          </p>
          <button
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setStage('forgot')}
          >
            Forgot Password?
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
