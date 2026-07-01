import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ContactCard from '../components/ContactCard';
import { Search, Tag, Star, X, PlusCircle, Frown, Loader2 } from 'lucide-react';

const Contacts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read initial states from URL parameters (if any)
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [favorite, setFavorite] = useState(searchParams.get('favorite') === 'true');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search;
      if (category) params.category = category;
      if (favorite) params.favorite = 'true';

      const res = await api.get('/contacts', { params });
      setContacts(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to fetch contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sync state changes with URL Search Params
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search;
    if (category) params.category = category;
    if (favorite) params.favorite = 'true';
    setSearchParams(params);
    
    fetchContacts();
  }, [search, category, favorite]);

  const handleToggleFavorite = async (id, currentFav) => {
    try {
      // Optimistic update
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, favorite: !currentFav } : c))
      );
      await api.put(`/contacts/${id}`, { favorite: !currentFav });
    } catch (err) {
      console.error('Error updating favorite status:', err);
      fetchContacts();
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/contacts/${id}`);
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        console.error('Error deleting contact:', err);
        fetchContacts();
      }
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setFavorite(false);
  };

  const categories = ['Family', 'Friends', 'Work', 'College', 'Others'];
  const hasActiveFilters = search.trim() || category || favorite;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-slate-805 dark:text-white">
            Contacts Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Search, filter, and manage your stored connections
          </p>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-card rounded-2xl p-4 border border-slate-150/40 dark:border-slate-800/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input (5 cols) */}
          <div className="relative md:col-span-5">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter (3 cols) */}
          <div className="relative md:col-span-3">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500">
              <Tag size={16} />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-450">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          {/* Favorite Toggle Button (3 cols) */}
          <button
            onClick={() => setFavorite(!favorite)}
            className={`md:col-span-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              favorite
                ? 'bg-amber-50 dark:bg-amber-955/20 border-amber-200 dark:border-amber-900/40 text-amber-500 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
            <span>Favorites Only</span>
          </button>

          {/* Clear Button (1 col) */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="md:col-span-1 p-2 flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-xl transition-all"
              title="Clear all filters"
            >
              <X size={18} />
              <span className="md:hidden text-sm font-semibold pl-1">Clear Filters</span>
            </button>
          )}

        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse-subtle">
            Fetching contacts list...
          </span>
        </div>
      ) : error ? (
        <div className="p-8 text-center glass-card rounded-2xl max-w-md mx-auto">
          <p className="text-rose-505 font-semibold mb-4">{error}</p>
          <button onClick={fetchContacts} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold">
            Retry
          </button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
          <div className="mx-auto w-fit p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
            <Frown size={32} />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-slate-800 dark:text-slate-200 text-lg">No Contacts Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {hasActiveFilters
                ? "We couldn't find any contacts matching your search filters."
                : "Your directory is currently empty. Get started by adding some contacts!"}
            </p>
          </div>
          <div>
            {hasActiveFilters ? (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                to="/add-contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all"
              >
                <PlusCircle size={16} />
                <span>Add Contact</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact._id} className="animate-slide-up">
              <ContactCard
                contact={contact}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteContact}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Contacts;
