import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ContactCard from '../components/ContactCard';
import { Users, Star, Heart, Briefcase, GraduationCap, Tag, PlusCircle, ArrowRight, Smile } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [favoriteContacts, setFavoriteContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, contactsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/contacts')
      ]);

      setStats(statsRes.data);
      setRecentContacts(contactsRes.data.slice(0, 3));
      setFavoriteContacts(contactsRes.data.filter(c => c.favorite).slice(0, 3));
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard details:', err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleFavorite = async (id, currentFav) => {
    try {
      await api.put(`/contacts/${id}`, { favorite: !currentFav });
      fetchDashboardData();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="p-6 glass-card rounded-2xl max-w-md mx-auto">
          <p className="text-rose-505 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Contacts',
      count: stats?.total || 0,
      icon: <Users size={20} />,
      colorClass: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40',
      link: '/contacts'
    },
    {
      title: 'Favorites',
      count: stats?.favorites || 0,
      icon: <Star size={20} fill="currentColor" />,
      colorClass: 'bg-amber-50 text-amber-550 border-amber-100 dark:bg-amber-955/20 dark:text-amber-450 dark:border-amber-900/40',
      link: '/contacts?favorite=true'
    },
    {
      title: 'Family',
      count: stats?.categories?.Family || 0,
      icon: <Heart size={20} />,
      colorClass: 'bg-purple-50 text-purple-650 border-purple-100 dark:bg-purple-955/20 dark:text-purple-400 dark:border-purple-900/40',
      link: '/contacts?category=Family'
    },
    {
      title: 'Friends',
      count: stats?.categories?.Friends || 0,
      icon: <Smile size={20} />,
      colorClass: 'bg-blue-55 border-blue-100 text-blue-650 dark:bg-blue-955/20 dark:text-blue-450 dark:border-blue-900/40',
      link: '/contacts?category=Friends'
    },
    {
      title: 'Work',
      count: stats?.categories?.Work || 0,
      icon: <Briefcase size={20} />,
      colorClass: 'bg-emerald-50 text-emerald-650 border-emerald-100 dark:bg-emerald-955/20 dark:text-emerald-450 dark:border-emerald-900/40',
      link: '/contacts?category=Work'
    },
    {
      title: 'College',
      count: stats?.categories?.College || 0,
      icon: <GraduationCap size={20} />,
      colorClass: 'bg-orange-50 text-orange-655 border-orange-105 dark:bg-orange-955/20 dark:text-orange-450 dark:border-orange-900/40',
      link: '/contacts?category=College'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-slate-800 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Realtime directory statistics and shortcuts panels
          </p>
        </div>

        {/* Quick action button */}
        <Link
          to="/add-contact"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all w-fit"
        >
          <PlusCircle size={16} />
          <span>New Contact</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`p-4 rounded-2xl border bg-white dark:bg-slate-900/40 flex flex-col justify-between hover:shadow-sm hover:scale-[1.02] transition-all duration-200 ${card.colorClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.title}</span>
              <div className="opacity-95">{card.icon}</div>
            </div>
            <div className="mt-4">
              <span className="font-outfit font-extrabold text-2xl tracking-tight">{card.count}</span>
              <p className="text-[10px] opacity-75 mt-0.5">View Category</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel 1: Recent Contacts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users size={18} className="text-slate-400" />
              <span>Recently Added</span>
            </h2>
            {recentContacts.length > 0 && (
              <Link to="/contacts" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                <span>View All</span>
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {recentContacts.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">No contacts saved yet.</p>
              <Link to="/add-contact" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2 inline-block hover:underline">
                Create one now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentContacts.map((contact) => (
                <div key={contact._id}>
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

        {/* Panel 2: Favorite Quick Dial Shortcut List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star size={18} fill="currentColor" className="text-amber-500" />
              <span>Favorites Shortcut</span>
            </h2>
            {favoriteContacts.length > 0 && (
              <Link to="/contacts?favorite=true" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                <span>View Favorites</span>
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {favoriteContacts.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">No favorite contacts yet.</p>
              <Link to="/contacts" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-2 inline-block hover:underline">
                Browse contacts to star
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {favoriteContacts.map((contact) => (
                <div key={contact._id}>
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

      </div>
    </div>
  );
};

export default Dashboard;
