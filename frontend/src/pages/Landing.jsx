import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 font-medium mb-8 animate-fade-in-up">
          <Shield size={16} /> Premium School Solution
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-slate-800 tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Next-Generation <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Education</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Streamline your school's administration, manage digital receipts, and track attendance seamlessly with Direct Access Syndicate.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {user ? (
            <Link to="/dashboard" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-green-500/30 hover:bg-green-700 transition-all border border-green-600">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-green-500/30 hover:bg-green-700 transition-all border border-green-600">
                Staff Login
              </Link>
              <Link to="/apply" className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all">
                Apply Now
              </Link>
            </>
          )}
          <Link to="/services" className="bg-white text-slate-700 px-8 py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all border border-slate-200">
            Learn More
          </Link>
        </div>
      </section>

      {/* Student Photography Gallery Section */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-4">Life at the Academy</h2>
            <p className="text-slate-600 text-lg">Experience the vibrant ecosystem of learning, discovery, and community growth.</p>
          </div>
          
          {/* Dynamic 6-Picture Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
             {/* Large featured spot */}
             <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 group relative">
                 <img src="/src/assets/gallery_3.png" alt="Students in Classroom" className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop' }} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <p className="text-white font-bold text-xl">Dynamic Learning Environments</p>
                 </div>
             </div>
             
             {/* Standard squares */}
             <div className="rounded-3xl overflow-hidden shadow-lg group">
                 <img src="/src/assets/gallery_1.png" alt="Student studying" className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop' }} />
             </div>
             <div className="rounded-3xl overflow-hidden shadow-lg group">
                 <img src="/src/assets/gallery_2.png" alt="Teachers and Students" className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop' }} />
             </div>

             {/* Bottom row items */}
             <div className="rounded-3xl overflow-hidden shadow-lg group">
                 <img src="/src/assets/gallery_4.png" alt="Outdoor physical activities" className="w-full h-full object-cover aspect-square md:aspect-video group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb046eb9?q=80&w=2043&auto=format&fit=crop' }} />
             </div>
             <div className="rounded-3xl overflow-hidden shadow-lg group">
                 <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop" alt="High School Laboratory" className="w-full h-full object-cover aspect-square md:aspect-video group-hover:scale-110 transition-transform duration-500" />
             </div>
             <div className="rounded-3xl overflow-hidden shadow-lg group col-span-2 md:col-span-1">
                 <img src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070&auto=format&fit=crop" alt="Students coding" className="w-full h-full object-cover aspect-[2/1] md:aspect-video group-hover:scale-110 transition-transform duration-500" />
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section Removed - Now a separate page */}

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
