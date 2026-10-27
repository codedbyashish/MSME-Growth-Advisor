import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-[#202B3C]">
        <div className="flex items-center space-x-3 rounded-xl border border-[#E7E3DC] bg-white px-5 py-3 shadow-sm">
          <div className="w-5 h-5 border-2 border-[#202B3C] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying authentication...</span>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
