import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      {/* Simple Nav */}
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
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">About DAS System</h1>
              <p className="text-xl text-slate-500 leading-relaxed">The Direct Access Syndicate (DAS) is built to eliminate paperwork and bridge the communication gap between parents, students, and administration.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
              <div className="relative">
                 <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
                 <img src="/src/assets/gallery_4.png" alt="Library" className="relative z-10 rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" onError={(e) => {e.target.style.display='none'}} />
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
                  <h2 className="text-3xl font-black text-slate-800 mb-6">Our Core Mission</h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    We believe in providing crystal clear transparency regarding financial receipts, expenses, and daily student activities through a fully modernized digital platform. 
                  </p>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    By heavily investing in our technological ecosystem, we empower our educators to focus on what they do best: teaching the next generation of leaders.
                  </p>
                  
                  <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-slate-700 font-medium">
                          <CheckCircle className="text-green-500 shrink-0" size={20} /> Integrity & Transparency
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 font-medium">
                          <CheckCircle className="text-green-500 shrink-0" size={20} /> Digital Excellence
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 font-medium">
                          <CheckCircle className="text-green-500 shrink-0" size={20} /> Parent-Teacher Synergy
                      </li>
                  </ul>
              </div>
          </div>

          {/* Leadership Profiles */}
          <div className="mt-16">
              <h2 className="text-3xl font-black text-center text-slate-800 mb-12">Our Leadership</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Proprietor */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center hover:-translate-y-1 transition-transform">
                      <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
                          <img src="/src/assets/proprietor.png" alt="Proprietor" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=P&background=0D8ABC&color=fff&size=200' }} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">Dr. Emmanuel Mensah</h3>
                      <p className="text-green-600 font-medium tracking-wide text-sm uppercase mb-4">Founder & Proprietor</p>
                      <p className="text-slate-600 leading-relaxed">Dr. Mensah founded DAS with the vision of creating an Africa-centric educational hub powered by world-class technology. With 20+ years in education administration across West Africa, he continues to steer the academy's growth.</p>
                  </div>

                  {/* Manager/Finance */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center hover:-translate-y-1 transition-transform">
                      <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
                          <img src="https://ui-avatars.com/api/?name=FM&background=059669&color=fff&size=200" alt="Financial Manager" className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1">Mrs. Aminata Conteh</h3>
                      <p className="text-green-600 font-medium tracking-wide text-sm uppercase mb-4">Financial Manager</p>
                      <p className="text-slate-600 leading-relaxed">Mrs. Conteh oversees the digital transition of our financial pipeline. Her implementation of Direct Access Syndicate Management has achieved 100% transparency in school fee tracking for our parent community.</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default About;
