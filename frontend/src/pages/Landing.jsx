import React from 'react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import VisitorChatbot from '../components/VisitorChatbot';
import { Shield, CheckCircle, Users, BookOpen, Receipt, MessageCircle, ArrowRight, Zap, Smartphone, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InstallButton from '../components/InstallButton';
import logo from '../assets/logo.png';
import gallery1 from '../assets/gallery_1.jpeg';
import gallery2 from '../assets/gallery_2.jpeg';
import gallery3 from '../assets/gallery_3.png';
import gallery4 from '../assets/gallery_4.jpeg';
import gallery5 from '../assets/gallery_5.jpeg';
import gallery6 from '../assets/gallery_6.jpeg';
import proprietorImg from '../assets/proprietor.jpeg';
import managerImg from '../assets/financial_manager.jpeg';
import developerImg from '../assets/developer.jpeg';

const Landing = () => {
  const { user, enterDemoMode } = useAuth();

  const handleDemo = (role) => {
    enterDemoMode(role);
    window.location.href = role === 'admin' ? '/admin' : '/parent';
  };

  const leadership = [
    {
      name: 'Alpha Amadu Bah',
      role: 'Proprietor',
      image: proprietorImg,
      desc: 'Visionary leader dedicated to educational excellence and community development in Sierra Leone.'
    },
    {
      name: 'Pastor Pratt',
      role: 'Financial Manager',
      image: managerImg,
      desc: 'Expert in financial stewardship, ensuring the Syndicate\'s resources are managed with integrity.'
    },
    {
      name: 'Joseph Nimneh',
      role: 'Lead Web Developer',
      image: developerImg,
      desc: 'Architect of the digital infrastructure powering DAS, bringing modern tech solutions to education.'
    }
  ];

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
      desc: 'Parents access their child\'s status, fees, and reports via secure WhatsApp Passwordless login.'
    },
    {
      icon: <Zap size={22} className="text-green-600" />,
      title: 'Real-Time Alerts',
      desc: 'Parents receive instant live notifications the moment a report or fee receipt is published.'
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
          <button 
            onClick={() => handleDemo('admin')}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
          >
            Experience the Portal <ArrowRight size={16} />
          </button>
          <InstallButton />
        </div>
      </section>

      {/* Why Choose DAS */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Smartphone className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black italic tracking-tight">Mobile First</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Designed to work perfectly on your phone. No complex app store downloads needed—install directly from your browser.</p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black italic tracking-tight">Ultra Secure</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Bank-grade data privacy. Parents only see their own children’s data, protected by WhatsApp 2FA verification.</p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-black italic tracking-tight">Built for SL</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Tailored specifically for Sierra Leonean schools, handling local fee structures and parent communication habits.</p>
            </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-100">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Meet Our Leadership</h2>
            <p className="text-slate-500 mt-2">The dedicated team behind the Syndicate's success.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leadership.map((leader, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:shadow-xl transition-all">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h4 className="text-xl font-black text-slate-800">{leader.name}</h4>
                        <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-3">{leader.role}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{leader.desc}</p>
                    </div>
                </div>
            ))}
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
              <img src={gallery3} alt="Students" className="w-full h-full object-cover aspect-[4/3] sm:aspect-auto group-hover:scale-105 transition-transform duration-500" />
            </div>
            {[
              { src: gallery1, alt: 'Student studying' },
              { src: gallery2, alt: 'Teachers and Students' },
              { src: gallery4, alt: 'Activities' },
              { src: gallery5, alt: 'Laboratory' },
              { src: gallery6, alt: 'Classroom' }
            ].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-md group ${i === 4 ? 'col-span-2 sm:col-span-1 aspect-[2/1] sm:aspect-square' : 'aspect-square'}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

      {/* Premium ROI Redesign - Located near bottom */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 sm:p-20 text-white relative overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-xs uppercase tracking-widest mb-8">
                    <Zap size={14} /> Efficiency Index
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-8 leading-[1.1] tracking-tight">
                    Built to Save You <span className="text-green-500">Time and Money</span>
                  </h2>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                    Say goodbye to manual filing and paper records. Our digital infrastructure automates your school's most tedious tasks so you can focus on education and financial stewardship.
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { title: '80% Faster Fee Processing', detail: 'Instant digital verification' },
                      { title: 'Zero Cost for Paper Receipts', detail: 'Save millions on printing annually' },
                      { title: 'Real-Time Parent Comm', detail: 'Automated WhatsApp synchronization' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{item.title}</p>
                          <p className="text-slate-500 text-sm font-medium">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 relative">
                  <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all">
                    <div className="text-5xl font-black mb-2 text-green-500">100%</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Digital Archive</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all mt-8">
                    <div className="text-5xl font-black mb-2 text-white">0%</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Paper Waste</div>
                  </div>
                  <div className="bg-green-600 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-green-600/20 group hover:scale-105 transition-all">
                    <div className="text-3xl font-black mb-1">REAL-TIME</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-100">WhatsApp Sync</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-all mt-8">
                    <div className="text-4xl font-black mb-2">AUTO</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Audit Trails</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">Developed with ❤️ by Joseph Nimneh</p>
          </div>
          <div className="flex gap-4">
            <Link to="/services" className="text-slate-400 hover:text-white text-xs transition-colors">Services</Link>
            <Link to="/about" className="text-slate-400 hover:text-white text-xs transition-colors">About</Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-xs transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      {/* AI Visitor Chatbot — floating widget for all visitors */}
      <VisitorChatbot />
    </div>
  );
};

export default Landing;
