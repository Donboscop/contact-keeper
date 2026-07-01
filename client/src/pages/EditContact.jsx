import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ContactForm from '../components/ContactForm';
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [contact, setContact] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/contacts/${id}`);
        setContact(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setError('Failed to load contact information. It may have been deleted.');
      } finally {
        setFetching(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/contacts/${id}`, formData);
      navigate('/contacts');
    } catch (err) {
      console.error('Error updating contact:', err);
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to update contact. Please try again.');
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
          Edit Contact
        </h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm mt-1">
          Modify the stored details for this contact
        </p>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-150/40 dark:border-slate-800/40">
        
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-650 dark:text-indigo-400" />
            <span className="text-sm text-slate-505 dark:text-slate-400">Loading contact details...</span>
          </div>
        ) : error && !contact ? (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <ContactForm
              initialData={contact}
              onSubmit={handleSubmit}
              submitText="Update Contact"
              loading={loading}
            />
          </>
        )}
      </div>

    </div>
  );
};

export default EditContact;
