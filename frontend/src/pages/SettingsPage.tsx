import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Sun,
  KeyRound,
  LogOut,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#17211B] dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-[#5F665F] dark:text-slate-400 mt-1">
          Manage your personal profile, credentials, and application preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#244D38] dark:text-brand-500" />
          <span>Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E756D] dark:text-slate-500 mb-1">
              Full Name
            </label>
            <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 text-sm font-medium text-[#17211B] dark:text-white">
              {user?.name || 'N/A'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E756D] dark:text-slate-500 mb-1">
              Email Address
            </label>
            <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 text-sm font-medium text-[#17211B] dark:text-white flex items-center justify-between">
              <span>{user?.email || 'N/A'}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F3EB] text-[#24543F] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E756D] dark:text-slate-500 mb-1">
              Account Role
            </label>
            <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 text-sm font-semibold flex items-center gap-2">
              <Shield className={`w-4 h-4 ${user?.role === 'ADMIN' ? 'text-amber-500' : 'text-[#244D38]'}`} />
              <span className={user?.role === 'ADMIN' ? 'text-amber-700 dark:text-amber-400' : 'text-[#244D38] dark:text-brand-400'}>
                {user?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E756D] dark:text-slate-500 mb-1">
              User ID
            </label>
            <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-slate-900/60 border border-[#E5DED4] dark:border-slate-800 text-sm font-mono text-[#5F665F] dark:text-slate-400">
              #{user?.id}
            </div>
          </div>
        </div>
      </div>

      {/* Appearance & Preferences (Day Mode Only) */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E4DDD2] p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#13211A] mb-2 flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#A8752F]" />
          <span>Appearance Mode</span>
        </h2>

        <p className="text-xs text-[#5F665F] mb-4">
          The portal operates in a dedicated Day Mode tailored with a warm ivory and forest green palette for maximum readability and eye comfort during long study sessions.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CCE0CE] bg-[#EBF3EC] text-[#24513A] text-xs font-bold shadow-xs">
          <Sun className="w-4 h-4 text-[#A8752F]" />
          <span>Day Mode (Active & Standard)</span>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="bg-[#FFFDF9] dark:bg-[#0D121F] rounded-3xl border border-[#E5DED4] dark:border-slate-800 p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#244D38] dark:text-brand-500" />
          <span>Security & Sessions</span>
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-[#E5DED4] dark:border-slate-800">
            <div>
              <p className="font-semibold text-[#17211B] dark:text-white">Authentication Architecture</p>
              <p className="text-xs text-[#5F665F] dark:text-slate-400">Stateless JSON Web Tokens with 7-day expiration</p>
            </div>
            <span className="text-xs font-medium text-[#24543F] bg-[#E8F3EB] px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#E5DED4] dark:border-slate-800">
            <div>
              <p className="font-semibold text-[#17211B] dark:text-white">Password Storage</p>
              <p className="text-xs text-[#5F665F] dark:text-slate-400">One-way bcrypt hash (10 salt rounds)</p>
            </div>
            <span className="text-xs font-medium text-[#24543F] bg-[#E8F3EB] px-2.5 py-1 rounded-full">
              Secured
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of All Sessions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
