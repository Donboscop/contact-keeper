import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, changePassword } = useAuth();
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const result = await changePassword(formData.oldPassword, formData.newPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Password updated successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      setErrorMsg(result.error || 'Failed to update password');
    }
  };

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 outline-none text-slate-800 dark:text-slate-100 bg-transparent ${
      errors[fieldName]
        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
    }`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="font-outfit font-extrabold text-3xl text-slate-800 dark:text-white">
          My Profile Settings
        </h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm mt-1">
          Manage your personal credentials and security keys
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column (1 of 3) */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-150/40 dark:border-slate-800/40 flex flex-col items-center text-center">
            {/* Avatar badge */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold text-3xl flex items-center justify-center shadow-md shadow-indigo-500/10">
              {user?.name ? (user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()) : 'U'}
            </div>
            
            <h2 className="font-outfit font-bold text-slate-800 dark:text-slate-100 text-xl mt-4">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-full">
              {user?.email}
            </p>
            
            <div className="w-full border-t border-slate-150 dark:border-slate-800 my-4" />
            
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-xl">
              <ShieldCheck size={14} />
              <span>Verified Session</span>
            </div>
          </div>
        </div>

        {/* Form Column (2 of 3) */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-150/40 dark:border-slate-800/40">
            <h3 className="font-outfit font-bold text-slate-800 dark:text-slate-200 text-lg mb-6 flex items-center gap-2">
              <Lock size={18} className="text-slate-400" />
              <span>Change Security Password</span>
            </h3>

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-955/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-sm flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Old password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Current Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="••••••••"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className={inputClass('oldPassword')}
                  />
                </div>
                {errors.oldPassword && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.oldPassword}</p>}
              </div>

              {/* New password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">New Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Min 6 characters"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={inputClass('newPassword')}
                  />
                </div>
                {errors.newPassword && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.newPassword}</p>}
              </div>

              {/* Confirm New password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="••••••••"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={inputClass('confirmNewPassword')}
                  />
                </div>
                {errors.confirmNewPassword && <p className="text-xs text-rose-505 mt-1 pl-1">{errors.confirmNewPassword}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed pt-2"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
