import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Briefcase, Star, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ContactCard = ({ contact, onToggleFavorite, onDelete }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const { _id, name, phone, email, address, company, category, notes, favorite } = contact;

  const handleFavoriteClick = async () => {
    setFavLoading(true);
    await onToggleFavorite(_id, favorite);
    setFavLoading(false);
  };

  const getInitials = (n) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const categoryColors = {
    Family: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40',
    Friends: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40',
    Work: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
    College: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40',
    Others: 'bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50'
  };

  const getAvatarBg = (cat) => {
    switch (cat) {
      case 'Family': return 'bg-gradient-to-tr from-purple-500 to-indigo-600';
      case 'Friends': return 'bg-gradient-to-tr from-blue-500 to-indigo-600';
      case 'Work': return 'bg-gradient-to-tr from-emerald-500 to-teal-600';
      case 'College': return 'bg-gradient-to-tr from-amber-500 to-orange-600';
      default: return 'bg-gradient-to-tr from-slate-500 to-slate-700';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative group border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between h-full">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            {/* User Avatar Initials */}
            <div className={`h-11 w-11 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0 ${getAvatarBg(category)}`}>
              {getInitials(name)}
            </div>
            
            {/* Name and Company */}
            <div className="min-w-0">
              <h3 className="font-outfit font-bold text-slate-850 dark:text-slate-100 truncate text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {name}
              </h3>
              {company && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                  <Briefcase size={12} className="shrink-0" />
                  <span>{company}</span>
                </p>
              )}
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`p-1.5 rounded-lg border transition-all ${
              favorite
                ? 'bg-amber-50 border-amber-200 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800'
            }`}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={16} fill={favorite ? 'currentColor' : 'none'} className={favLoading ? 'animate-pulse' : ''} />
          </button>
        </div>

        {/* Contact Info Fields */}
        <div className="space-y-2.5 text-sm text-slate-650 dark:text-slate-300">
          {/* Phone (tel Link) */}
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-405 transition-colors group/link truncate"
          >
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-950/30 dark:text-slate-400 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-405 transition-colors shrink-0">
              <Phone size={14} />
            </div>
            <span className="font-medium truncate">{phone}</span>
          </a>

          {/* Email (mailto Link) */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-405 transition-colors group/link truncate"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-950/30 dark:text-slate-400 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-405 transition-colors shrink-0">
                <Mail size={14} />
              </div>
              <span className="truncate">{email}</span>
            </a>
          )}

          {/* Address */}
          {address && (
            <div className="flex items-center gap-2.5 truncate">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                <MapPin size={14} />
              </div>
              <span className="truncate" title={address}>{address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800">
        {/* Badges and actions bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Category Badge */}
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border shrink-0 ${categoryColors[category] || categoryColors.Others}`}>
            {category}
          </span>

          <div className="flex items-center gap-1">
            {/* Edit */}
            <Link
              to={`/edit-contact/${_id}`}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 transition-colors"
              title="Edit Contact"
            >
              <Edit2 size={14} />
            </Link>
            
            {/* Delete */}
            <button
              onClick={() => onDelete(_id, name)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
              title="Delete Contact"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Collapsible Notes Section */}
        {notes && (
          <div className="mt-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-550 hover:text-slate-750 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              {showNotes ? (
                <>
                  <ChevronUp size={12} />
                  <span>Hide Notes</span>
                </>
              ) : (
                <>
                  <ChevronDown size={12} />
                  <span>Show Notes</span>
                </>
              )}
            </button>

            {showNotes && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-150/30 dark:border-slate-800/40 text-xs text-slate-650 dark:text-slate-400 animate-slide-up whitespace-pre-line leading-relaxed max-h-24 overflow-y-auto">
                {notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
