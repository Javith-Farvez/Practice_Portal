import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import api from '../api/axios';
import {
  Code2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        login(response.data.data.token, response.data.data.user);
        navigate(from, { replace: true });
      } else {
        setErrorMessage(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Unable to connect to authentication server. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F2EA] dark:bg-[#16120E] text-[#13211A] dark:text-[#FAF6EE] transition-colors flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-md w-full">
          {/* Main Login Card matching Image 1 Design System */}
          <div className="bg-[#FFFDF9] dark:bg-[#1E1813] rounded-3xl border border-[#E4DDD2] dark:border-[#382D24] p-8 sm:p-10 shadow-sm shadow-stone-900/5">
            
            {/* Card Header & Redesigned Icon (Soft green/cream rounded square - NO neon gradient) */}
            <div className="text-center mb-8">
              <div className="w-13 h-13 rounded-2xl bg-[#DCE9DD] dark:bg-[#202E24] border border-[#CCE0CE] dark:border-[#2D4534] flex items-center justify-center text-[#24513A] dark:text-[#A7D8B7] mx-auto mb-4 shadow-xs">
                <Code2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#13211A] dark:text-[#FAF6EE]">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-[#5F665F] dark:text-[#BDB7AB] mt-1.5">
                Log in to continue your placement preparation
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#FEF2F2] dark:bg-[#2D1616] border border-[#FCA5A5] dark:border-[#572222] flex items-start gap-2.5 text-[#991B1B] dark:text-[#F87171] text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13211A] dark:text-[#FAF6EE] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F665F] dark:text-[#8F948F]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F4EE] dark:bg-[#261F1A] border border-[#E4DDD2] dark:border-[#3C3229] text-[#13211A] dark:text-[#FAF6EE] placeholder-[#8F948F] focus:outline-none focus:ring-2 focus:ring-[#24513A]/20 focus:border-[#24513A] text-xs sm:text-sm transition-all font-normal"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13211A] dark:text-[#FAF6EE]">
                    Password
                  </label>
                  <span className="text-xs text-[#5F665F] hover:text-[#24513A] dark:hover:text-[#A7D8B7] cursor-not-allowed">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F665F] dark:text-[#8F948F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F4EE] dark:bg-[#261F1A] border border-[#E4DDD2] dark:border-[#3C3229] text-[#13211A] dark:text-[#FAF6EE] placeholder-[#8F948F] focus:outline-none focus:ring-2 focus:ring-[#24513A]/20 focus:border-[#24513A] text-xs sm:text-sm transition-all font-normal"
                  />
                </div>
              </div>

              {/* Primary Action: Forest Green Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#24513A] hover:bg-[#1D432F] shadow-sm shadow-[#24513A]/25 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 text-center text-xs text-[#5F665F] dark:text-[#BDB7AB]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#24513A] dark:text-[#A7D8B7] hover:underline"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Editorial Trust Note below card */}
          <div className="mt-6 text-center text-[11px] text-[#5F665F] dark:text-[#8F948F] flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#24513A] dark:text-emerald-400" />
            <span>Secure Placement Session • Encrypted Credentials</span>
          </div>
        </div>
      </div>
    </div>
  );
};
