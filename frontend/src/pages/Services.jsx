import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, MapPin, BarChart3, Users, Clock, Shield } from 'lucide-react';

const Services = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center gap-2 text-green-600 font-black tracking-tight text-2xl">
                 <div className="bg-green-600 rounded-xl p-2 h-10 w-10 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <span className="text-white text-xl">D</span>
                </div>
                DAS
              </Link>
              <Link to="/" className="text-slate-600 hover:text-green-600 font-medium transition-colors">
                  Back to Home
              </Link>
            </div>
          </div>
        </nav>
  
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">Premium Services Ecosystem</h1>
                <p className="text-xl text-slate-500 leading-relaxed">We provide a fully integrated digital ecosystem governing administration, financial tracking, and transparent parental reporting.</p>
            </div>
  
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <CheckCircle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Receipts (QR)</h3>
                    <p className="text-slate-600 leading-relaxed">Generate beautiful, printable physical and digital receipts instantly with integrated QR code verification mechanisms to prevent forgery.</p>
                </div>
  
                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Student Management</h3>
                    <p className="text-slate-600 leading-relaxed">Efficiently register students via our public Application Portal. Link students directly to Parent portals for integrated family management.</p>
                </div>
  
                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Clock size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Attendance Tracking</h3>
                    <p className="text-slate-600 leading-relaxed">Keep absolute track of daily attendance records, giving authenticated parents direct, real-time insight into their child's school presence.</p>
                </div>

                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Behavioral Reports</h3>
                    <p className="text-slate-600 leading-relaxed">Admins generate behavioral and academic credibility scores that are synchronized directly to Parent portals and shareable via WhatsApp.</p>
                </div>

                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BarChart3 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Financial Analytics</h3>
                    <p className="text-slate-600 leading-relaxed">In-depth statistical breakdown of all revenue streams split by class levels, alongside meticulous operational expense (OpEx) tracking.</p>
                </div>

                {/* Service Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Shield size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Role-Based Security</h3>
                    <p className="text-slate-600 leading-relaxed">Enterprise-grade JWT authentication isolating the Admin dashboards from Parent portals, ensuring absolute data privacy and integrity.</p>
                </div>
            </div>
        </div>
      </div>
    );
  };
  
  export default Services;
