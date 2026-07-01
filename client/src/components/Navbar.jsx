import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, LogOut, User, PlusCircle, BookOpen, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold'
        : 'text-slate-655 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
    }`;

  const mobileNavLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-xl text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                <BookOpen size={20} />
              </div>
              <span className="font-outfit font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                ContactKeeper
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link to="/contacts" className={navLinkClass('/contacts')}>
                  <BookOpen size={16} />
                  Contacts
                </Link>
                <Link to="/add-contact" className={navLinkClass('/add-contact')}>
                  <PlusCircle size={16} />
                  Add Contact
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  <User size={16} />
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass('/login')}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-200">
                  Register
                </Link>
              </>
            )}

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Greeting & Logout */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 pl-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden lg:inline">
                  Hi, {user?.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-sm font-medium transition-all"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link to="/contacts" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/contacts')}>
                  <BookOpen size={18} />
                  Contacts
                </Link>
                <Link to="/add-contact" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/add-contact')}>
                  <PlusCircle size={18} />
                  Add Contact
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/profile')}>
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-base font-semibold transition-all mt-4"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className={mobileNavLinkClass('/login')}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block mx-4 my-2 text-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/10"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
