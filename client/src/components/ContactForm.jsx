import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Briefcase, Tag, FileText, Star } from 'lucide-react';

const ContactForm = ({ initialData, onSubmit, submitText = 'Save Contact', loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    category: 'Others',
    notes: '',
    favorite: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        company: initialData.company || '',
        category: initialData.category || 'Others',
        notes: initialData.notes || '',
        favorite: !!initialData.favorite
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleFavorite = () => {
    setFormData((prev) => ({ ...prev, favorite: !prev.favorite }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const categories = ['Family', 'Friends', 'Work', 'College', 'Others'];

  const inputClass = (fieldName) =>
    `w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 outline-none text-slate-800 dark:text-slate-100 bg-transparent ${
      errors[fieldName]
        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15'
    }`;

  const iconClass = (fieldName) =>
    `absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
      errors[fieldName] ? 'text-rose-450' : 'text-slate-455 dark:text-slate-600'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Name *</label>
        <div className="relative">
          <div className={iconClass('name')}><User size={18} /></div>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={inputClass('name')}
          />
        </div>
        {errors.name && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.name}</p>}
      </div>

      {/* Phone & Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Phone *</label>
          <div className="relative">
            <div className={iconClass('phone')}><Phone size={18} /></div>
            <input
              type="text"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
            />
          </div>
          {errors.phone && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
          <div className="relative">
            <div className={iconClass('email')}><Mail size={18} /></div>
            <input
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1 pl-1">{errors.email}</p>}
        </div>
      </div>

      {/* Company & Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Company</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"><Briefcase size={18} /></div>
            <input
              type="text"
              name="company"
              placeholder="Acme Corp"
              value={formData.company}
              onChange={handleChange}
              className={inputClass('company')}
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Category</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"><Tag size={18} /></div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-550/15 outline-none transition-all duration-200 appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* Custom arrow down for select */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Address</label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600"><MapPin size={18} /></div>
          <input
            type="text"
            name="address"
            placeholder="123 Main St, Springfield"
            value={formData.address}
            onChange={handleChange}
            className={inputClass('address')}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Notes / Remarks</label>
        <div className="relative">
          <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-600"><FileText size={18} /></div>
          <textarea
            name="notes"
            rows="3"
            placeholder="Met at networking event, interested in partnership..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-550/15 outline-none transition-all duration-200 resize-y"
          ></textarea>
        </div>
      </div>

      {/* Favorite & Submit button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        {/* Toggle Favorite */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
            formData.favorite
              ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-605 dark:text-amber-400 font-semibold'
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Star size={16} fill={formData.favorite ? 'currentColor' : 'none'} className={formData.favorite ? 'animate-pulse-subtle' : ''} />
          {formData.favorite ? 'Marked as Favorite' : 'Mark as Favorite'}
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
