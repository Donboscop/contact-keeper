import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, Zap, Heart } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/10">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles size={12} className="animate-pulse" />
          <span>Keep your connections organized</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="font-outfit font-extrabold text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-white leading-none">
            Smart contact management,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
              simplified.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-650 dark:text-slate-400 leading-relaxed font-sans">
            A beautiful, lightweight, and secure dashboard to save, search, and categorize your personal and professional connections. Powered by React & MongoDB.
          </p>
        </div>

        {/* Call to actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-base font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transform hover:-translate-y-0.5 transition-all text-center"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 glass hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-2xl text-base font-semibold border border-slate-200 dark:border-slate-800 transition-all text-center"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-outfit font-bold text-slate-805 dark:text-slate-100 text-lg mb-2">Category Filters</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Group contacts into Family, Friends, Work, College, or other clusters to locate them instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
            <div className="p-2.5 w-fit rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 mb-4">
              <Heart size={20} fill="currentColor" />
            </div>
            <h3 className="font-outfit font-bold text-slate-850 dark:text-slate-100 text-lg mb-2">Favorite Toggle</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Star your close contacts to build a shortcut list in your dashboard for immediate dialing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 mb-4">
              <Shield size={20} />
            </div>
            <h3 className="font-outfit font-bold text-slate-850 dark:text-slate-100 text-lg mb-2">Secure & Private</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict owner isolation powered by JWT tokens. Your contact database is visible only to you.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
