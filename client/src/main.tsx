import React from 'react';
import "@fontsource/merienda";
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; // ✅ ensure this exists
import axios from 'axios';

// ✅ Set Axios defaults globally
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* 🔐 Wraps App for login/register access */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
