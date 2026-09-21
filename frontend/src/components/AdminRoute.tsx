import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Verifying privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          This section requires administrative privileges. Your current account role is <strong className="text-brand-500">{user?.role}</strong>.
        </p>
        <a
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
