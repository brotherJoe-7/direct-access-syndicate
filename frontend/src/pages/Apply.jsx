import React, { useState } from 'react';
import api from '../utils/api';
import { Send, CheckCircle, GraduationCap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STREAMS } from '../constants/streams';

const Apply = () => {
  const [formData, setFormData] = useState({
     student_name: '', level: '', parent_name: '', contact: '',
     address: '', previous_school: '', alt_contact: '', student_number: ''
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalFees, setTotalFees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentStream = STREAMS.find(s => s.id === formData.level);

  const handleLevelChange = (level) => {
      setFormData({ ...formData, level });
      
      const newStream = STREAMS.find(s => s.id === level);
      if (newStream) {
          const coreSubjects = newStream.subjects.filter(s => s.includes('(Core)'));
          setSelectedSubjects(coreSubjects);
          setTotalFees(coreSubjects.length * newStream.pricePerSubject);
      } else {
          setSelectedSubjects([]);
          setTotalFees(0);
      }
  };

  const toggleSubject = (subject) => {
      if (subject.includes('(Core)')) return;

      const isSelected = selectedSubjects.includes(subject);
      const newSubjects = isSelected 
        ? selectedSubjects.filter(s => s !== subject)
        : [...selectedSubjects, subject];
      
      setSelectedSubjects(newSubjects);
      if (currentStream) {
          setTotalFees(newSubjects.length * currentStream.pricePerSubject);
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          await api.post('/students/apply', {
              ...formData,
              subjects_enrolled: selectedSubjects,
              total_fees_assessed: totalFees
          });
          setSuccess(true);
      } catch (err) {
          console.error('Error submitting application', err);
          alert('Error submitting application. Please try again later.');
      } finally {
          setLoading(false);
      }
  }

  if (success) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center shadow-xl border border-slate-100">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Application Received!</h2>
                  <p className="text-slate-500 mb-8">Thank you for choosing DAS. Our administration team will review your application and contact you shortly.</p>
                  <Link to="/" className="inline-flex items-center justify-center w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all">
                      Return to Home
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white mb-6 shadow-lg">
                <GraduationCap size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Join The Syndicate</h1>
            <p className="text-lg text-slate-500">Submit an application for new student enrollment. No account required.</p>
        </div>

        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 mb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Student Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-2">Student Information</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Student Full Name *</label>
                            <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} placeholder="e.g. John Smith" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Student Phone No. (Optional)</label>
                            <input type="text" value={formData.student_number} onChange={(e) => setFormData({...formData, student_number: e.target.value})} placeholder="+232 XX XXXXXX" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">School (Optional)</label>
                            <input type="text" value={formData.previous_school} onChange={(e) => setFormData({...formData, previous_school: e.target.value})} placeholder="Name of school attended" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>
                        
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Desired Class Level *</label>
                            <div className="relative">
                                <select 
                                    required 
                                    value={formData.level} 
                                    onChange={(e) => handleLevelChange(e.target.value)} 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Select Grade Level --</option>
                                    {STREAMS.map(stream => <option key={stream.id} value={stream.id}>{stream.name}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {currentStream && (
                    <div className="space-y-4 animate-fade-in bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Course Subject Checklist</label>
                        <p className="text-xs text-slate-500 mb-4">Core subjects are pre-selected. Click optional subjects to attach them to your application.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentStream.subjects.map(subject => {
                                const isCore = subject.includes('(Core)');
                                const isSelected = selectedSubjects.includes(subject);
                                return (
                                    <button
                                        key={subject}
                                        type="button"
                                        onClick={() => toggleSubject(subject)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-semibold ${
                                            isCore 
                                                ? 'bg-slate-200 border-slate-300 text-slate-800 cursor-not-allowed opacity-90'
                                                : isSelected 
                                                    ? 'bg-green-100 border-green-500 text-green-800 shadow-sm' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'
                                        }`}
                                    >
                                        {subject.replace(' (Core)', '')}
                                        {isSelected && <Check size={16} className={isCore ? "text-slate-500" : "text-green-600"} />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 text-white shadow-lg shadow-green-500/20 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Total Fee Assessment</p>
                                <p className="text-[10px] mt-1 opacity-80">{selectedSubjects.length} subjects selected</p>
                            </div>
                            <p className="text-2xl font-black">SLL {totalFees.toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {/* Section 2: Parent/Guardian Information */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 border-b border-slate-100 pb-2">Guarantor / Parent details</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Parent/Guardian Full Name *</label>
                            <input type="text" required value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value})} placeholder="Name of primary contact" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Primary Phone / WhatsApp *</label>
                            <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="+232 XX XXXXXX" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Alternate Contact No. (Optional)</label>
                            <input type="text" value={formData.alt_contact} onChange={(e) => setFormData({...formData, alt_contact: e.target.value})} placeholder="+232 XX XXXXXX" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold tracking-wide text-slate-700 mb-2 uppercase">Home Address (Optional)</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Full residential physical address" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder:text-slate-400" />
                        </div>
                    </div>
                </div>
                
                <div className="pt-6">
                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                        {loading ? 'Submitting Application...' : <><Send size={20} /> Submit Application</>}
                    </button>
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Back to Home</Link>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Apply;
