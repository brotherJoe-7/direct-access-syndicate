import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, MapPin, BarChart3, Users, Clock, Shield } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import logo from '../assets/logo.png';

const Services = () => {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <PublicNav />
  
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <img src={logo} alt="DAS" className="h-12 w-12 rounded-xl mx-auto mb-4 object-cover shadow" />
                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-3">Our Services</h1>
                <p className="text-sm text-slate-500 leading-relaxed">A fully integrated digital ecosystem for school administration, financial tracking, and parent communication.</p>
            </div>
  
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Service Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Digital Receipts (QR)</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Generate printable and digital receipts instantly with integrated QR code verification to prevent forgery.</p>
                </div>
  
                {/* Service Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Student Management</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Register students via our Application Portal. Link students to Parent portals with unique registration codes.</p>
                </div>
  
                {/* Service Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Clock size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Attendance Tracking</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Track daily attendance records with real-time parent insight into their child's school presence.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Behavioral Reports</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Generate behavioral and academic credibility scores synchronized to Parent portals and shareable via WhatsApp.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BarChart3 size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Financial Analytics</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Statistical breakdown of all revenue streams by class level plus meticulous operational expense tracking.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-11 h-11 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Shield size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">Role-Based Security</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">JWT authentication isolating Admin dashboards from Parent portals, ensuring data privacy and integrity.</p>
                </div>
            </div>
        </div>

        <footer className="bg-slate-900 py-6 px-4 text-center">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default Services;
