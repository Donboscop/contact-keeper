import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, isAuthenticated, error: authError, setError } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear auth errors when mounting
  useEffect(() => {
    setError(null);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/10">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        
        {/* Title */}
        <div className="text-center">
          <h2 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
            Sign up to start organizing your contacts
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-slate-150/40 dark:border-slate-800/40">
          
          {/* Global Auth Error Alert */}
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 transition-all outline-none ${
                    errors.name
                      ? 'border-rose-550 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 transition-all outline-none ${
                    errors.email
                      ? 'border-rose-550 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 transition-all outline-none ${
                    errors.password
                      ? 'border-rose-550 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 transition-all outline-none ${
                    errors.confirmPassword
                      ? 'border-rose-550 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-550 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Register;
