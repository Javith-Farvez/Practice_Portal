import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Menu,
  LogOut,
  Bell,
  Check,
  CheckCheck,
  GraduationCap,
  Sparkles,
  Flame,
  Users,
  Award,
  X,
} from 'lucide-react';

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications?limit=10');
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unread_count);
      }
    } catch {
      // Silently continue
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s background poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: number, link: string | null) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) {
        setShowNotifications(false);
        navigate(link);
      }
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'PROBLEM_SOLVED':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'ACHIEVEMENT_UNLOCKED':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'STREAK_MILESTONE':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'FRIEND_REQUEST':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#16110D] transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-[#16110D]/85 backdrop-blur-md border-b border-amber-200/50 dark:border-stone-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-amber-100 dark:hover:bg-stone-800 lg:hidden focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Placement Mode Button */}
            <Link
              to="/placement"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:scale-[1.02] transition-all"
            >
              <GraduationCap className="w-4 h-4 text-brand-500" />
              <span>Placement Mode</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#0D121F] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-500">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-brand-500 hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet. Activity, milestone, and friend updates will appear here.
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id, n.link)}
                          className={`p-3 rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${!n.is_read
                              ? 'bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-900/40'
                              : 'bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                            }`}
                        >
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Pill or Guest Buttons */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
                <Link to="/profile" title="View Student Profile" className="text-right hidden sm:block hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F2421] dark:text-stone-200 bg-[#FAF6EE] dark:bg-stone-800 hover:bg-[#F0EAE0] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#E76F51] hover:bg-[#d85e40] shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
