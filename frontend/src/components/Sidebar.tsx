import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Coffee,
  Terminal,
  Binary,
  BrainCircuit,
  Send,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  ChevronRight,
  Database,
  Users,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const primaryNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const trackNavItems = [
    { name: 'Java', path: '/java', icon: Coffee, badge: 'Track' },
    { name: 'DSA', path: '/dsa', icon: Binary, badge: 'Core' },
    { name: 'Aptitude', path: '/aptitude', icon: BrainCircuit, badge: 'Prep' },
  ];

  // Removed: Placement Mode, Daily Practice, Bookmarks, Friends
  const practiceNavItems = [
    { name: 'Submissions', path: '/submissions', icon: Send },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const accountNavItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-[#244D38]/10 text-[#244D38] dark:text-emerald-400 font-bold shadow-2xs'
        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800/70 hover:text-[#17211B] dark:hover:text-stone-200'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 bg-[#FFFDF9] dark:bg-[#1E1813] border-r border-[#E5DED4] dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header: JavaTrack Branding */}
        <div className="h-16 px-5 border-b border-[#E5DED4] dark:border-stone-800 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#244D38] text-white flex items-center justify-center font-black text-sm shadow-sm">
              JT
            </div>
            <div>
              <span className="font-extrabold text-[#17211B] dark:text-white tracking-tight text-base">JavaTrack</span>
              <p className="text-[10px] text-[#5F665F] dark:text-stone-400 tracking-wide font-medium">Learn • Practice • Grow</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Main Overview */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 mb-2">
              Overview
            </div>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-[#244D38] dark:group-hover:text-emerald-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Learning Tracks */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 mb-2">
              Learning Tracks
            </div>
            <nav className="space-y-1">
              {trackNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-[#244D38] dark:group-hover:text-emerald-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#F0EBE2] dark:bg-stone-800 text-[#5F665F] dark:text-stone-400">
                      {item.badge}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Practice & Tools (Filtered) */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 mb-2">
              Practice & Analytics
            </div>
            <nav className="space-y-1">
              {practiceNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-[#244D38] dark:group-hover:text-emerald-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Account */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#5F665F] dark:text-stone-400 mb-2">
              Account
            </div>
            <nav className="space-y-1">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={linkClasses}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-stone-400 group-hover:text-[#244D38] dark:group-hover:text-emerald-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* ADMIN ONLY Navigation Section */}
          {user?.role === 'ADMIN' && (
            <div className="pt-2 border-t border-[#E5DED4] dark:border-stone-800">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administration
              </div>
              <nav className="space-y-1">
                <NavLink
                  to="/admin"
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800 hover:text-[#17211B]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>System Metrics</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/admin/problems"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800 hover:text-[#17211B]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Problem Management</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/admin/users"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800 hover:text-[#17211B]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>User Directory</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/admin/import"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800 hover:text-[#17211B]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bulk Import</span>
                  </div>
                </NavLink>

                <NavLink
                  to="/admin/audit"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                        : 'text-[#5F665F] dark:text-stone-400 hover:bg-[#F0EBE2] dark:hover:bg-stone-800 hover:text-[#17211B]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Audit Logs</span>
                  </div>
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-[#E5DED4] dark:border-stone-800 bg-[#F8F5EE] dark:bg-stone-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#244D38] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#17211B] dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      user?.role === 'ADMIN' ? 'bg-amber-500' : 'bg-[#4E8A61]'
                    }`}
                  />
                  <p className="text-xs text-[#5F665F] dark:text-stone-400 truncate">
                    {user?.role || 'STUDENT'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
