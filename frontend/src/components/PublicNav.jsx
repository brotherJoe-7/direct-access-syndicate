import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import InstallButton from './InstallButton';

const PublicNav = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logo} alt="DAS Logo" className="h-9 w-9 rounded-lg object-cover shadow" />
            <span className="text-slate-800 font-black text-base tracking-tight leading-tight">
              Direct Access <span className="text-green-600">Syndicate</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-green-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                to="/dashboard"
                className="ml-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-semibold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
              >
                Sign In
              </Link>
            )}
            <InstallButton className="py-2 text-xs" />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3 shadow-xl">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                location.pathname === link.to
                  ? 'bg-green-50 text-green-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="bg-green-600 text-white text-sm px-4 py-2.5 rounded-lg font-semibold text-center mt-1"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="bg-green-600 text-white text-sm px-4 py-2.5 rounded-lg font-semibold text-center mt-1"
            >
              Sign In
            </Link>
          )}
          <InstallButton className="mt-2 w-full justify-center" />
        </div>
      )}
    </nav>
  );
};

export default PublicNav;
