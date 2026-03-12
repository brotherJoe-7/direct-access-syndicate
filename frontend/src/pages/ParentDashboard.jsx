import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useVoice } from '../hooks/useVoice';
import {
  CalendarCheck, Receipt, UserCheck, Camera, GraduationCap, Wallet,
  Volume2, VolumeX, Users, ChevronDown, RefreshCw, Link as LinkIcon, X
} from 'lucide-react';

const ParentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { speak, isSpeaking, stop } = useVoice();

  const fetchData = async () => {
    try {
      const [dashRes, profileRes, childrenRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/parents/profile'),
        api.get('/parents/children').catch(() => ({ data: [] }))
      ]);
      setStats(dashRes.data);
      setParent(profileRes.data);
      const fetchedChildren = childrenRes.data || [];
      setChildren(fetchedChildren);
      if (fetchedChildren.length > 0 && !selectedChild) {
        setSelectedChild(fetchedChildren[0]);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profile_image', file);
    setUploading(true);
    try {
      await api.post('/parents/profile/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchData();
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally { setUploading(false); }
  };



  const readDashboard = () => {
    const text = `Hello ${parent?.parent_name || 'Parent'}. 
      ${selectedChild ? `You are viewing ${selectedChild.student_name}'s records. ` : ''}
      ${stats ? `Your child has attended ${stats.attendance_count || 0} days, 
        received ${stats.total_receipts || 0} receipts totalling ${stats.total_paid || 0} Leones.` : 'Data is loading.'}`;
    if (isSpeaking) { stop(); } else { speak(text); }
  };

  if (loading) return (
    <>
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm">Loading Parent Portal...</p>
      </div>
    </>
  );

  const profileImgSrc = parent?.profile_img
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${parent.profile_img}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(parent?.parent_name || 'P')}&background=059669&color=fff&size=200`;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header: Profile + Listen */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 mb-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative flex items-start gap-4">
            {/* Profile Photo */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow">
                <img src={profileImgSrc} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 cursor-pointer shadow hover:scale-110 transition-transform">
                <Camera size={12} className="text-green-600" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>

            {/* Greeting */}
            <div className="flex-1 min-w-0">
              <p className="text-green-100 text-xs mb-0.5">Parent Portal</p>
              <h1 className="text-lg font-black truncate">Hello, {parent?.parent_name || 'Parent'}!</h1>
              <p className="text-green-100 text-xs">Track your {children.length > 1 ? 'children\'s' : 'child\'s'} progress</p>
            </div>

            {/* Voice Button */}
            <button
              onClick={readDashboard}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSpeaking ? 'bg-white/30 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Multi-Child Switcher */}
        {children.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-slate-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Children</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex-1 min-w-[140px] p-3 rounded-xl border-2 text-left transition-all ${
                    selectedChild?.id === child.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selectedChild?.id === child.id ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {child.student_name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{child.student_name}</p>
                      <p className="text-xs text-slate-400">{child.level || 'N/A'}</p>
                    </div>
                  </div>
                  {child.reg_code && (
                    <p className="text-xs text-green-600 font-mono mt-1">{child.reg_code}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty Children State */}
        {children.length === 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <Users size={32} className="mx-auto text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-amber-800 mb-1">No Students Linked</h3>
            <p className="text-sm text-amber-600 max-w-sm mx-auto">
              You do not have any active children linked to your account. Please contact the school administration to bind your student records to this profile.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Days Attended', value: stats.attendance_count || 0, icon: <CalendarCheck size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Receipts', value: stats.total_receipts || 0, icon: <Receipt size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Amount Paid', value: `Le ${(stats.total_paid || 0).toLocaleString()}`, icon: <Wallet size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-lg font-black text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'View Receipts', icon: <Receipt size={22} />, link: '/parent/receipts', color: 'bg-green-600', desc: 'All payment records' },
            { label: 'Attendance Report', icon: <CalendarCheck size={22} />, link: '/parent/attendance', color: 'bg-blue-600', desc: 'Daily attendance log' },
            { label: 'Progress Report', icon: <GraduationCap size={22} />, link: '/parent/reports', color: 'bg-purple-600', desc: 'Teacher feedback' },
            { label: 'WhatsApp Bot', icon: <UserCheck size={22} />, href: 'https://wa.me/23278003333?text=Report', color: 'bg-emerald-600', desc: 'Chat with school' },
          ].map((action, i) => (
            action.href ? (
              <a key={i} href={action.href} target="_blank" rel="noreferrer"
                className={`${action.color} text-white rounded-2xl p-4 flex flex-col gap-2 hover:opacity-90 transition-opacity shadow`}>
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">{action.icon}</div>
                <p className="font-bold text-sm">{action.label}</p>
                <p className="text-xs opacity-75">{action.desc}</p>
              </a>
            ) : (
              <a key={i} href={action.link}
                className={`${action.color} text-white rounded-2xl p-4 flex flex-col gap-2 hover:opacity-90 transition-opacity shadow`}>
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">{action.icon}</div>
                <p className="font-bold text-sm">{action.label}</p>
                <p className="text-xs opacity-75">{action.desc}</p>
              </a>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export default ParentDashboard;
