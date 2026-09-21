import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, ServerCrash, ArrowLeft, Home, RotateCcw } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-500 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The requested module, problem, or pathway could not be found. It may have been relocated or unpublished.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/20 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500 mb-2">
        Error 403
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
        Access Restricted
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        This area requires administrative privileges. Your current account role does not have authorization to view this resource.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-lg transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export const ServerErrorPage: React.FC<{ error?: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
        <ServerCrash className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-500 mb-2">
        Error 500
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
        Server Error
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">
        We encountered an unexpected issue while communicating with the service.
      </p>
      {error && (
        <pre className="p-3 mb-6 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-rose-600 dark:text-rose-400 max-w-md overflow-x-auto">
          {error}
        </pre>
      )}

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        )}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
