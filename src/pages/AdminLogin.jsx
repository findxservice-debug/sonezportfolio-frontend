import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { login } = useAuth();
  const { setCurrentPage } = useSite();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      setCurrentPage('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sonez-blue/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header back button */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('portfolio')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-futuristic text-xl font-black tracking-wider text-white">
            SONEZ
          </span>
          <span className="px-2 py-0.5 bg-sonez-blue text-white text-[10px] font-mono uppercase font-bold rounded">
            PORTAL
          </span>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto bg-gray-900/90 border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-sonez-blue/20 text-sonez-blue rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sonez-blue/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-bold-display text-2xl font-bold tracking-tight text-white">
            Secure Admin Access
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Authenticate to manage portfolio content, live visitor chats, products, and analytics.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl mb-6 text-xs text-rose-300 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-sonez-blue focus:ring-1 focus:ring-sonez-blue transition-all"
                placeholder="example@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-sonez-blue focus:ring-1 focus:ring-sonez-blue transition-all"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

        

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-sonez-blue hover:bg-sonez-blueHover disabled:opacity-50 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
          >
            {submitting ? 'Verifying...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>

      {/* Security note footer */}
      <div className="relative z-10 text-center text-xs text-gray-500 font-mono">
        SONEZ Portfolio CMS • Protected by Bcrypt & JWT Authorization
      </div>
    </div>
  );
}
