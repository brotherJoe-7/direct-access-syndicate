import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, MapPin, BarChart3, Users, Clock, Shield } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import logo from '../assets/logo.png';
import { STREAMS } from '../constants/streams';

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
  
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {STREAMS.map((stream, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col group">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{stream.name}</h3>
                        <div className="mb-6">
                            <div className="text-xl font-bold text-slate-900">Le {stream.basePrice.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Base Fee</span></div>
                            <div className="text-sm font-bold text-green-600">+ Le {stream.pricePerSubject.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Per Subject</span></div>
                        </div>
                        
                        <div className="space-y-3 mb-8 flex-1">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Subjects</p>
                            {stream.subjects.slice(0, 5).map((sub, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    {sub}
                                </div>
                            ))}
                            {stream.subjects.length > 5 && <p className="text-xs text-slate-400 italic mt-2">+ {stream.subjects.length - 5} more subjects</p>}
                        </div>

                        <Link 
                            to="/apply" 
                            className={`w-full py-4 rounded-2xl text-center font-black transition-all active:scale-95 shadow-lg shadow-slate-200 ${
                                idx === 0 ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            ENROLL NOW
                        </Link>
                    </div>
                ))}
            </div>
        </div>
  
        <footer className="bg-slate-900 py-6 px-4 text-center">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default Services;
