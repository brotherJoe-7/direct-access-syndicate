import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Shield } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import logo from '../assets/logo.png';
import gallery4 from '../assets/gallery_4.jpeg';
import proprietorImg from '../assets/proprietor.jpeg';
import managerImg from '../assets/financial_manager.jpeg';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <PublicNav />

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
              <img src={logo} alt="DAS" className="h-14 w-14 rounded-xl mx-auto mb-4 object-cover shadow" />
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-4">About Direct Access Syndicate</h1>
              <p className="text-base text-slate-500 leading-relaxed">Eliminating paperwork and bridging the communication gap between parents, students, and administration.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
              <div className="relative">
                 <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
                 <img src={gallery4} alt="Library" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
                 <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block z-20">
                    <div className="flex items-center gap-4">
                        <Shield className="text-green-500" size={32} />
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Trusted By</p>
                            <p className="text-slate-500">Leading Educators</p>
                        </div>
                    </div>
                 </div>
              </div>
              <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-4">Our Core Mission</h2>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    We believe in providing crystal clear transparency regarding financial receipts, expenses, and daily student activities through a fully modernized digital platform. 
                  </p>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    By heavily investing in our technological ecosystem, we empower our educators to focus on what they do best: teaching the next generation of leaders.
                  </p>
                  
                  <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                          <CheckCircle className="text-green-500 shrink-0" size={18} /> Integrity & Transparency
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                          <CheckCircle className="text-green-500 shrink-0" size={18} /> Digital Excellence
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                          <CheckCircle className="text-green-500 shrink-0" size={18} /> Parent-Teacher Synergy
                      </li>
                  </ul>
              </div>
          </div>

          <div className="mt-10">
              <h2 className="text-2xl font-black text-center text-slate-800 mb-8">Our Leadership</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Proprietor */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center hover:-translate-y-1 transition-transform">
                      <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
                          <img src={proprietorImg} alt="Proprietor" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">Alpha Amadu Bah</h3>
                      <p className="text-green-600 font-medium tracking-wide text-sm uppercase mb-4">Founder & Proprietor</p>
                      <p className="text-slate-600 leading-relaxed">Alpha Amadu Bah founded DAS with the vision of creating an Africa-centric educational hub powered by world-class technology. He continues to steer the academy's growth with unwavering dedication to excellence.</p>
                  </div>

                  {/* Manager/Finance */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center hover:-translate-y-1 transition-transform">
                      <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
                          <img src={managerImg} alt="Financial Manager" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">Joseph Nimneh</h3>
                      <p className="text-green-600 font-medium tracking-wide text-sm uppercase mb-4">Financial Manager</p>
                      <p className="text-slate-600 leading-relaxed">Joseph Nimneh oversees the digital transition of our financial pipeline. His implementation of Direct Access Syndicate has achieved 100% transparency in school fee tracking for our parent community.</p>
                  </div>
              </div>
          </div>
      </div>

      <footer className="bg-slate-900 py-6 px-4 text-center">
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Direct Access Syndicate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
