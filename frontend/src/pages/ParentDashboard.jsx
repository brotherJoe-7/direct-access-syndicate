import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useVoice } from '../hooks/useVoice';
import { ASSETS_BASE_URL } from '../config';
import { CalendarCheck, Receipt, UserCheck, Search, Filter, HelpCircle, Clock, Camera, GraduationCap, Wallet, Info, Volume2, VolumeX } from 'lucide-react';

const ParentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { speak, isSpeaking, stop } = useVoice();

  const fetchData = async () => {
    try {
      const [dashRes, profileRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/parents/profile')
      ]);
      setStats(dashRes.data);
      setParent(profileRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    setUploading(true);
    try {
      await api.post('/parents/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData(); // Refresh to show new image
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
      <Layout>
          <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
              <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Loading Parent Portal...</p>
          </div>
      </Layout>
  );

  if (!stats) return <Layout><div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-medium">Failed to load portal data.</div></Layout>;

  return (
    <Layout>
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              {parent?.profile_img ? (
                <img src={`${ASSETS_BASE_URL}${parent.profile_img}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl font-bold text-slate-400">{parent?.parent_name?.charAt(0)}</div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-1.5 bg-green-600 text-white rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-green-700 transition-colors">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Hello, {parent?.parent_name}!</h1>
                <button 
                  onClick={() => isSpeaking ? stop() : speak(`Hello ${parent?.parent_name}. Welcome to your family portal. You have ${stats?.receiptCount || 0} receipts in your vault.`)}
                  className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  title="Listen to greeting"
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>
            <p className="text-slate-500 font-medium">Welcome to your family portal.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
             <a href="https://wa.me/14155238886?text=Menu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-2xl shadow-lg shadow-[#25D366]/30 font-black hover:bg-[#128C7E] hover:shadow-[#25D366]/40 transition-all active:scale-95 text-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                     <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                 </svg> WhatsApp AI Help
             </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                   <p className="text-green-400 font-bold uppercase tracking-widest text-xs mb-3">Household Overview</p>
                   <h2 className="text-3xl font-black mb-1">Global Attendance</h2>
                   <p className="text-slate-400 font-medium">Combined records for all enrolled dependents</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-32 text-center">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Present</p>
                        <p className="text-4xl font-black text-white">{stats.totalAttendance.present}</p>
                    </div>
                    <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 w-32 text-center">
                        <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-2">Absent</p>
                        <p className="text-4xl font-black text-white">{stats.totalAttendance.absent}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100/60 flex flex-col justify-center items-center text-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative z-10">
                 <div className="mx-auto w-20 h-20 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-3xl mb-6 shadow-xl shadow-emerald-500/10">
                    <Wallet size={40} strokeWidth={2.5} />
                 </div>
                 <h3 className="text-5xl font-black text-slate-800 mb-2">{stats.receiptCount}</h3>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-center">
                    <Info size={14} /> Total Receipts
                 </p>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Student Status</h3>
              <p className="text-blue-100 font-medium mb-6">Track your children's progress and enrollment details.</p>
              <div className="flex gap-2 w-full mt-auto">
                <button className="flex-1 py-3 bg-white text-blue-600 rounded-xl font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg">VIEW</button>
                <button 
                  onClick={() => speak("Student Status. Track your children's progress and enrollment details.")}
                  className="px-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                >
                  <Volume2 size={20} />
                </button>
              </div>
          </div>

          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Receipt size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Payment Logs</h3>
              <p className="text-emerald-100 font-medium mb-6">Check all your paid fees and download formal receipts.</p>
              <div className="flex gap-2 w-full mt-auto">
                <button className="flex-1 py-3 bg-white text-emerald-600 rounded-xl font-black hover:bg-emerald-50 transition-all active:scale-95 shadow-lg">RECEIPTS</button>
                <button 
                  onClick={() => speak("Payment Logs. Check all your paid fees and download formal receipts. You have " + stats?.receiptCount + " receipts available.")}
                  className="px-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                >
                  <Volume2 size={20} />
                </button>
              </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Clock size={32} />
              </div>
              <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Attendance</h3>
              <p className="text-slate-400 font-medium mb-6">Monitor daily presence and absence of your children.</p>
              <div className="flex gap-2 w-full mt-auto">
                <button className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-black hover:bg-slate-50 transition-all active:scale-95 shadow-lg">TRACK</button>
                <button 
                  onClick={() => speak("Attendance. Monitor daily presence and absence of your children.")}
                  className="px-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                >
                  <Volume2 size={20} />
                </button>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100/60 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                      <UserCheck size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Dependent Matrix</h2>
              </div>
              <div className="flex gap-3">
                  <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search child..." className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none w-full sm:w-auto" />
                  </div>
                  <button className="p-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                      <Filter size={20} />
                  </button>
              </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="pb-4 pt-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4">Student Profile</th>
                  <th className="pb-4 pt-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4 text-center">Status</th>
                  <th className="pb-4 pt-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4 text-center">Present Days</th>
                  <th className="pb-4 pt-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4 text-center">Absent Days</th>
                  <th className="pb-4 pt-2 text-xs font-black text-slate-400 uppercase tracking-widest px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.childrenAttendance?.map((child, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                            {child.student_name.charAt(0)}
                        </div>
                        {child.student_name}
                    </td>
                    <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Enrolled
                        </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-100/50">
                            {child.present}
                        </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                        <span className="px-4 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm border border-rose-100/50">
                            {child.absent}
                        </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                        <button className="text-sm font-bold text-green-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">View Profile</button>
                    </td>
                  </tr>
                ))}
                {(!stats.childrenAttendance || stats.childrenAttendance.length === 0) && (
                  <tr>
                      <td colSpan="5" className="py-16 text-center">
                          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                              <Search className="text-slate-300" size={24} />
                          </div>
                          <p className="text-slate-500 font-medium max-w-sm mx-auto">No dependents currently linked to your household matrix. Visit the Enrollment portal to add them.</p>
                      </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </Layout>
  );
};

export default ParentDashboard;
