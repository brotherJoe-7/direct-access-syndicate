import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, MessageSquare, Star, Share2, Award, Calendar } from 'lucide-react';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' or 'grades'
  const { role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
     student_id: '', subject: '', feedback_text: '', credibility_score: 5
  });
  const [aiLoading, setAiLoading] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const { data } = await api.get('/feedbacks');
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedbacks', err);
    }
  }, []);

  const fetchGrades = useCallback(async () => {
      try {
          if (role === 'parent') {
              const childrenRes = await api.get('/parents/children');
              const children = childrenRes.data || [];
              const allGrades = await Promise.all(children.map(c => api.get(`/grades/${c.id}`)));
              setGrades(allGrades.flatMap(r => r.data));
          }
      } catch (err) {
          console.error('Failed to fetch grades', err);
      }
  }, [role]);

  const fetchStudents = useCallback(async () => {
    if (role === 'admin' || role === 'teacher') {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    }
  }, [role]);

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await Promise.all([fetchFeedbacks(), fetchGrades(), fetchStudents()]);
        setLoading(false);
    };
    init();
  }, [role, fetchFeedbacks, fetchGrades, fetchStudents]);

  const handleAiAssist = async () => {
    if (!formData.student_id || !formData.subject) {
        alert('Please select a student and subject first');
        return;
    }
    setAiLoading(true);
    
    const callAi = async (isRetry = false) => {
        try {
            const student = students.find(s => s.id === parseInt(formData.student_id));
            const { data } = await api.post('/ai/academic-assistant', {
                type: 'feedback',
                studentName: student?.student_name || 'the student',
                subject: formData.subject,
                context: formData.feedback_text 
            });
            setFormData({ ...formData, feedback_text: data.text });
            return true;
        } catch (err) {
            if (!isRetry) {
                console.log('AI busy, retrying once...');
                await new Promise(r => setTimeout(r, 1500));
                return await callAi(true);
            }
            throw err;
        }
    };

    try {
        await callAi();
    } catch (err) {
        console.error('AI Assist Error:', err);
        const msg = err.response?.data?.message || 'AI Assistant is busy';
        alert(`${msg}. Please try again in a moment.`);
    } finally {
        setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/feedbacks', formData);
          setShowModal(false);
          setFormData({ student_id: '', subject: '', feedback_text: '', credibility_score: 5 });
          fetchFeedbacks(); // refresh list
      } catch (err) {
          alert('Failed to submit feedback');
          console.error(err);
      }
  };

  const handleWhatsAppShare = (feedback) => {
      const text = `*DAS Premium Report Card*\n\n*Student:* ${feedback.student_name}\n*Teacher:* ${feedback.teacher_name}\n*Credibility Score:* ${feedback.credibility_score}/10\n*Subject:* ${feedback.subject}\n\n*Remarks:*\n${feedback.feedback_text}\n\n-- Generated from Direct Access Syndicate Management`;
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const ScoreBadge = ({ score }) => {
      let colorClass = 'bg-red-100 text-red-600';
      if (score >= 8) colorClass = 'bg-green-100 text-green-700';
      else if (score >= 5) colorClass = 'bg-yellow-100 text-yellow-700';

      return (
          <span className={`px-3 py-1 text-sm font-bold rounded-full flex items-center gap-1 w-max ${colorClass}`}>
              <Star size={14} fill="currentColor" /> {score}/10
          </span>
      )
  };

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Reports & Feedback</h1>
        {(role === 'admin' || role === 'teacher') ? (
          <p className="text-slate-500 mt-1">
              Manage and issue credibility reports for students.
          </p>
        ) : (
          <p className="text-slate-500 mt-1">
              View performance and behavioral reports from teachers.
          </p>
        )}
      </div>
      {(role === 'admin' || role === 'teacher') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle size={20} /> Create Report
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-100 pb-px">
          {['feedback', ...(role === 'parent' ? ['grades'] : [])].map(tab => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                  {tab === 'feedback' ? 'Teacher Feedback' : 'Academic Grades'}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>}
              </button>
          ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
            <div className="w-8 h-8 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'feedback' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
             <div key={feedback.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow relative overflow-hidden group">
                 {/* Decorative background element */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>
                 
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shadow-inner">
                            <Award size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{feedback.student_name}</h3>
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5"><Calendar size={12}/> {new Date(feedback.created_at).toLocaleDateString()}</p>
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
                     <p className="text-xs font-semibold text-slate-400 text-right pt-1">Report by: <span className="text-green-600">{feedback.teacher_name}</span></p>
                 </div>

                 {role === 'parent' && (
                     <button onClick={() => handleWhatsAppShare(feedback)} className="mt-5 w-full flex justify-center items-center gap-2 py-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white rounded-xl font-bold shadow-md shadow-green-500/20 active:scale-95 transition-all">
                         <Share2 size={18} /> Share via WhatsApp
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {grades.map((grade) => (
                <div key={grade.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/60 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
                            grade.score >= 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                            <span className="text-lg">{grade.score}%</span>
                            <span className="text-[10px] uppercase tracking-tighter opacity-70">{grade.grade}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{grade.subject}</h3>
                            <p className="text-xs font-semibold text-slate-400 mt-1">{grade.term}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-600 italic">
                        "{grade.remarks}"
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Student: {grade.student_name || 'Linked Child'}</p>
                </div>
            ))}
            {grades.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                    <Award size={56} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Grades Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Academic scores for this term have not been published yet.</p>
                </div>
            )}
        </div>
      )}

      {/* Modal */}
      {showModal && (role === 'admin' || role === 'teacher') && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Issue Student Report</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Select Student</label>
                  <select required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">-- Choose Student --</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.student_name}</option>)}
                  </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Category / Subject</label>
                  <input type="text" placeholder="e.g. Mathematics, General Conduct..." required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Credibility / Performance Score (1-10)</label>
                  <input type="number" min="1" max="10" required value={formData.credibility_score} onChange={(e) => setFormData({...formData, credibility_score: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">Detailed Feedback</label>
                    <button 
                        type="button"
                        onClick={handleAiAssist}
                        disabled={aiLoading}
                        className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100 disabled:opacity-50"
                    >
                        {aiLoading ? 'Generating...' : '✨ AI Assist'}
                    </button>
                  </div>
                  <textarea rows="4" required placeholder="Observations, remarks, next steps..." value={formData.feedback_text} onChange={(e) => setFormData({...formData, feedback_text: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none custom-scrollbar"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedbacks;
