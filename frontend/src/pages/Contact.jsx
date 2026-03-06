import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
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
          <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Contact Us</h1>
              <p className="text-lg text-slate-500 leading-relaxed">Have questions about enrollment, academics, or our digital ecosystem? Reach out to our administration team instantly.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Direct Contact Cards */}
              <div className="space-y-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                          <MessageCircle size={32} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">WhatsApp Rapid Support</h3>
                          <p className="text-slate-500 mb-4">Click below to open a direct chat with our reception desk on WhatsApp.</p>
                          <a href="https://wa.me/23278003333" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-[#25D366] hover:text-[#1ebd5b] transition-colors">
                              Chat with Proprietor →
                          </a>
                      </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                          <Phone size={32} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Call Financial Manager</h3>
                          <p className="text-slate-500 mb-4">Available Mon-Fri, 8 AM to 5 PM GMT.</p>
                          <a href="tel:073573032" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors">
                              073573032
                          </a>
                      </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6">
                      <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center shrink-0">
                          <MapPin size={32} />
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Main Campus</h3>
                          <p className="text-slate-500">Syke street at arthodox school<br/>near flaming church<br/>Freetown, Sierra Leone</p>
                      </div>
                  </div>
              </div>

              {/* Social & Email Form Area */}
              <div className="bg-slate-900 text-white p-10 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <h3 className="text-2xl font-bold mb-8 relative z-10">Connect on Social Media</h3>
                  <p className="text-slate-400 mb-10 relative z-10">Follow our social channels for the latest academic news, event galleries, and student achievements.</p>
                  
                  <div className="grid grid-cols-2 gap-4 relative z-10 mb-12">
                      <a href="#" className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-all group">
                          <Facebook className="text-blue-500 group-hover:scale-110 transition-transform" /> 
                          <span className="font-medium text-slate-200">Facebook</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-all group">
                          <Twitter className="text-cyan-400 group-hover:scale-110 transition-transform" /> 
                          <span className="font-medium text-slate-200">Twitter</span>
                      </a>
                      <a href="#" className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-all group">
                          <Linkedin className="text-blue-400 group-hover:scale-110 transition-transform" /> 
                          <span className="font-medium text-slate-200">LinkedIn</span>
                      </a>
                      <a href="mailto:support@dasys.edu" className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700 p-4 rounded-xl border border-slate-700 transition-all group">
                          <Mail className="text-slate-300 group-hover:scale-110 transition-transform" /> 
                          <span className="font-medium text-slate-200">Email Us</span>
                      </a>
                  </div>

                  <div className="pt-8 border-t border-slate-800 relative z-10 text-center">
                       <p className="text-sm text-slate-500">© {new Date().getFullYear()} DAS Digital Ecosystem</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Contact;
