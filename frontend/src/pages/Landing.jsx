import React from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import { Shield, CheckCircle, Users, BookOpen, Receipt, MessageCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Receipt size={22} className="text-green-600" />,
      title: 'Digital Receipts',
      desc: 'Issue and track all payment receipts digitally. Share via WhatsApp or PDF instantly.'
    },
    {
      icon: <CheckCircle size={22} className="text-green-600" />,
      title: 'Attendance Tracking',
      desc: 'Automated daily attendance records with real-time parent notifications.'
    },
    {
      icon: <Users size={22} className="text-green-600" />,
      title: 'Parent Portal',
      desc: 'Parents access their child\'s status, fees, and reports from any device — anywhere.'
    },
    {
      icon: <MessageCircle size={22} className="text-green-600" />,
      title: 'WhatsApp Integration',
      desc: 'Send receipts and updates directly to parents via WhatsApp — no app download needed.'
    },
    {
      icon: <BookOpen size={22} className="text-green-600" />,
      title: 'Student Profiles',
      desc: 'Full student records, registration codes, and academic history at your fingertips.'
    },
    {
      icon: <Shield size={22} className="text-green-600" />,
      title: 'Secure Admin Panel',
      desc: 'Role-based access control. Admins and parents see only what they need to.'
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <PublicNav />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="DAS Logo" className="h-20 w-20 rounded-2xl object-cover shadow-xl shadow-green-500/10" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 font-medium text-xs mb-6">
          <Shield size={12} /> Trusted School Management Platform
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-5 leading-tight">
          Direct Access <span className="text-green-600">Syndicate</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
          A complete digital platform for school management. Track fees, attendance, and student records — and keep parents informed in real-time via WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {user ? (
            <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all flex items-center gap-2 text-sm">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all flex items-center gap-2 text-sm">
                Sign In <ArrowRight size={16} />
              </Link>
              <Link to="/apply" className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm">
                Apply Now
              </Link>
            </>
          )}
          <Link to="/services" className="border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-semibold hover:border-slate-300 transition-all text-sm">
            Learn More
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-slate-50 py-16 px-4 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Life at the Syndicate</h2>
            <p className="text-slate-500 text-sm">A vibrant learning community built for excellence.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="col-span-2 sm:col-span-1 row-span-2 rounded-2xl overflow-hidden shadow-md group">
              <img src="/src/assets/gallery_3.png" alt="Students" className="w-full h-full object-cover aspect-[4/3] sm:aspect-auto group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop' }} />
            </div>
            {[
              { src: '/src/assets/gallery_1.jpeg', alt: 'Student studying', fallback: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop' },
              { src: '/src/assets/gallery_2.jpeg', alt: 'Teachers and Students', fallback: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' },
              { src: '/src/assets/gallery_4.jpeg', alt: 'Activities', fallback: 'https://images.unsplash.com/photo-1544367567-0f2fcb046eb9?q=80&w=800&auto=format&fit=crop' },
              { src: '/src/assets/gallery_5.jpeg', alt: 'Laboratory', fallback: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop' },
              { src: '/src/assets/gallery_6.jpeg', alt: 'Classroom', fallback: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop' }
            ].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-md group ${i === 4 ? 'col-span-2 sm:col-span-1 aspect-[2/1] sm:aspect-square' : 'aspect-square'}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={img.fallback ? (e) => { e.target.src = img.fallback } : undefined} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Everything You Need</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">One platform to manage your entire school — from fees to attendance to parent communication.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-14 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to get started?</h2>
        <p className="text-green-100 text-sm mb-6 max-w-sm mx-auto">Join the modern way of school administration in Sierra Leone.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/apply" className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-all">
            Apply Now
          </Link>
          <Link to="/contact" className="border border-green-400 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 transition-all">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="DAS Logo" className="h-7 w-7 rounded object-cover" />
            <span className="text-white font-bold text-sm">Direct Access Syndicate</span>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/services" className="text-slate-400 hover:text-white text-xs transition-colors">Services</Link>
            <Link to="/about" className="text-slate-400 hover:text-white text-xs transition-colors">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-xs transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
