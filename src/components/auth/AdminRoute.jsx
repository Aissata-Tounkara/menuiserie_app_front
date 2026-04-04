import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { ROUTES } from '../../lib/utils/constants';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          <p className="mt-4 text-gray-500">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.CLIENTS} replace />;
  }

  return children;
}
