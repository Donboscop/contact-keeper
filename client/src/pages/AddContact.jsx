import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ContactForm from '../components/ContactForm';
import { ChevronLeft, AlertCircle } from 'lucide-react';

const AddContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/contacts', formData);
      navigate('/contacts');
    } catch (err) {
      console.error('Error creating contact:', err);
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to add contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
        <span>Back</span>
      </button>

      {/* Title */}
      <div>
        <h1 className="font-outfit font-extrabold text-3xl text-slate-850 dark:text-white">
          Add New Contact
        </h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm mt-1">
          Store a new contact in your secure directory
        </p>
      </div>

      {/* Form Container Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-150/40 dark:border-slate-800/40">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <ContactForm onSubmit={handleSubmit} submitText="Create Contact" loading={loading} />
      </div>

    </div>
  );
};

export default AddContact;
