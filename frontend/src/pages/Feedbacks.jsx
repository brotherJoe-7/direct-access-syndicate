import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, MessageSquare, Star, Share2, Award, Calendar, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '', subject: '', feedback_text: '', credibility_score: 5
  });

  // Image preview state
  const [previewFeedback, setPreviewFeedback] = useState(null);
  const reportRef = useRef(null);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await api.get('/feedbacks');
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedbacks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (role === 'admin') {
      try {
        const { data } = await api.get('/students');
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStudents();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedbacks', formData);
      setShowModal(false);
      setFormData({ student_id: '', subject: '', feedback_text: '', credibility_score: 5 });
      fetchFeedbacks();
    } catch (err) {
      alert('Failed to submit feedback');
      console.error(err);
    }
  };

  // Capture the report card div as an image and download it
  const handleDownloadAndShare = async (feedback) => {
    setPreviewFeedback(feedback);
    // Wait for render
    setTimeout(async () => {
      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      // Download image
      const link = document.createElement('a');
      link.download = `DAS_Report_${feedback.student_name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Open WhatsApp with text
      const text = `*DAS Premium Report Card*\n\n*Student:* ${feedback.student_name}\n*Teacher:* ${feedback.teacher_name}\n*Credibility Score:* ${feedback.credibility_score}/10\n*Subject:* ${feedback.subject}\n\n*Remarks:*\n${feedback.feedback_text}\n\n📎 Report image downloaded. Please attach it to this message.\n\n-- Generated from Direct Access Syndicate`;
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
      
      setPreviewFeedback(null);
    }, 500);
  };

  const ScoreBadge = ({ score }) => {
    let colorClass = 'bg-red-100 text-red-600';
    if (score >= 8) colorClass = 'bg-green-100 text-green-700';
    else if (score >= 5) colorClass = 'bg-yellow-100 text-yellow-700';
    return (
      <span className={`px-3 py-1 text-sm font-bold rounded-full flex items-center gap-1 w-max ${colorClass}`}>
        <Star size={14} fill="currentColor" /> {score}/10
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Reports & Feedback</h1>
          <p className="text-slate-500 mt-1">
            {role === 'admin' ? 'Manage and issue credibility reports for students.' : 'View performance and behavioral reports from teachers.'}
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle size={20} /> Create Report
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shadow-inner">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{feedback.student_name}</h3>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {new Date(feedback.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ScoreBadge score={feedback.credibility_score} />
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Subject / Category</span>
                  <span className="font-medium text-slate-700">{feedback.subject}</span>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 leading-relaxed text-sm text-slate-600 italic">
                  "{feedback.feedback_text}"
                </div>
                <p className="text-xs font-semibold text-slate-400 text-right pt-1">
                  Report by: <span className="text-green-600">{feedback.teacher_name}</span>
                </p>
              </div>

              {role === 'parent' && (
                <button
                  onClick={() => handleDownloadAndShare(feedback)}
                  className="mt-5 w-full flex justify-center items-center gap-2 py-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-xl font-bold shadow-md shadow-green-500/20 active:scale-95 transition-all"
                >
                  <Download size={16} />
                  <Share2 size={16} />
                  Download & Share via WhatsApp
                </button>
              )}
            </div>
          ))}

          {feedbacks.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
              <MessageSquare size={56} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Reports Available</h3>
              <p className="text-slate-500 max-w-sm mx-auto">There are currently no performance or credibility reports available in the system.</p>
            </div>
          )}
        </div>
      )}

      {/* Admin Modal - Create Report */}
      {showModal && role === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Issue Student Report</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Select Student</label>
                <select required value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                  <option value="">-- Choose Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.student_name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Category / Subject</label>
                <input type="text" placeholder="e.g. Mathematics, General Conduct..." required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Credibility / Performance Score (1-10)</label>
                <input type="number" min="1" max="10" required value={formData.credibility_score} onChange={(e) => setFormData({ ...formData, credibility_score: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Detailed Feedback</label>
                <textarea rows="4" required placeholder="Observations, remarks, next steps..." value={formData.feedback_text} onChange={(e) => setFormData({ ...formData, feedback_text: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none custom-scrollbar"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Report Card for Image Capture */}
      {previewFeedback && (
        <div className="fixed top-[-9999px] left-[-9999px]">
          <div ref={reportRef} style={{ width: '600px', padding: '40px', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #16a34a', paddingBottom: '16px' }}>
              <div style={{ marginRight: 16 }}>
                <img src="/logo.png" alt="DAS Logo" style={{ height: 64, width: 64, objectFit: 'contain' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0 }}>Direct Access Syndicate</h1>
                <p style={{ color: '#16a34a', fontSize: 14, fontWeight: 700, margin: 0 }}>Student Credibility Report</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div><p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Student Name</p><p style={{ color: '#1e293b', fontWeight: 700, fontSize: 16 }}>{previewFeedback.student_name}</p></div>
              <div><p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Report Date</p><p style={{ color: '#1e293b', fontWeight: 700, fontSize: 16 }}>{new Date(previewFeedback.created_at).toLocaleDateString()}</p></div>
              <div><p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Subject / Category</p><p style={{ color: '#1e293b', fontWeight: 700, fontSize: 16 }}>{previewFeedback.subject}</p></div>
              <div><p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Performance Score</p><p style={{ color: '#16a34a', fontWeight: 900, fontSize: 24 }}>{previewFeedback.credibility_score}/10</p></div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px', marginBottom: '20px' }}>
              <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Teacher's Remarks</p>
              <p style={{ color: '#334155', fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>"{previewFeedback.feedback_text}"</p>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'right' }}>Report by: <strong style={{ color: '#16a34a' }}>{previewFeedback.teacher_name}</strong></p>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: 11 }}>This report was generated by Direct Access Syndicate — Perseverance & Excellence</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Feedbacks;
