import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 transition-all top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="DAS Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            <span className="text-green-600 font-black tracking-tight text-xl md:text-2xl hidden sm:block">
              DAS
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
