import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F6F2EA]/90 border-b border-[#E4DDD2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name matching Image 1 / Image 2 */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#DCE9DD] border border-[#CCE0CE] flex items-center justify-center text-[#24513A] shadow-xs group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#13211A] flex items-center gap-1">
              Placement<span className="text-[#B96545]">Portal</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[#5F665F]">
              Campus Placement Practice
            </span>
          </div>
        </Link>

        {/* Navigation Actions (Day Mode Only) */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#24513A] hover:bg-[#1D432F] rounded-xl shadow-sm shadow-[#24513A]/20 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-[#5F665F] hover:text-red-600 hover:bg-[#FAF0EB] border border-transparent hover:border-[#F1D6CA] transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs sm:text-sm font-bold text-[#13211A] hover:text-[#24513A] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#24513A] hover:bg-[#1D432F] rounded-xl shadow-sm shadow-[#24513A]/20 hover:shadow-md transition-all"
              >
                <span>Start Practicing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
