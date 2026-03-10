import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed w-full bg-white shadow-md z-[100] border-b border-slate-200 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo.png" alt="DAS Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-green-600 font-black tracking-tighter text-2xl hidden sm:block">
              Direct Access Syndicate
            </span>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base">
            <Link to="/services" className="text-slate-600 hover:text-green-600 font-semibold transition-colors">Services</Link>
            <Link to="/about" className="text-slate-600 hover:text-green-600 font-semibold transition-colors">About Us</Link>
            <Link to="/contact" className="text-slate-600 hover:text-green-600 font-semibold transition-colors">Contact</Link>
            
            {user ? (
              <Link to="/dashboard" className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all">
                Portal
              </Link>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
