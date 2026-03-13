import React, { useState } from 'react';
import api from '../utils/api';
import { Send, CheckCircle, GraduationCap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STREAMS } from '../constants/streams';

const Apply = () => {
  const [formData, setFormData] = useState({
     student_name: '', level: '', parent_name: '', contact: ''
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
          // Pre-select core subjects automatically
          const coreSubjects = newStream.subjects.filter(s => s.includes('(Core)'));
          setSelectedSubjects(coreSubjects);
          setTotalFees(coreSubjects.length * newStream.pricePerSubject);
      } else {
          setSelectedSubjects([]);
          setTotalFees(0);
      }
  };

  const toggleSubject = (subject) => {
      // Prevent un-ticking core subjects
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
    <div className="min-h-screen bg-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-serif">
        
        <div className="max-w-4xl w-full bg-white shadow-2xl border-4 border-slate-800 p-8 sm:p-12 relative overflow-hidden">
            {/* Watermark/Background texture hint */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>

            {/* Official Header */}
            <div className="relative z-10 text-center border-b-4 border-slate-800 pb-8 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-24 h-24 border-2 border-slate-800 border-dashed flex items-center justify-center text-xs text-slate-400 font-bold uppercase text-center bg-slate-50">
                        Attach<br/>Passport<br/>Photo
                    </div>
                    <div className="flex-1 px-4">
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-slate-900 mb-2 font-serif">Direct Access Syndicate</h1>
                        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-700 font-serif">Student Enrolment Form</h2>
                        <div className="inline-block mt-2 px-4 py-1 border-2 border-slate-800 text-sm font-bold tracking-widest uppercase">
                            Form 01 - Admission
                        </div>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center">
                        {/* Space for an official stamp/logo */}
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center">
                            <GraduationCap size={40} className="text-slate-200" />
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-600 italic font-medium">Please complete all required fields in BLOCK CAPITALS. This form mirrors official WASSCE registration standards.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                {/* Section A: Personal Details */}
                <div className="border-2 border-slate-800 p-6 bg-slate-50/50">
                    <h3 className="absolute -mt-10 bg-white px-2 text-lg font-black uppercase tracking-widest text-slate-800">Section A: Candidate Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black tracking-widest text-slate-800 mb-2 uppercase">1. Full Name of Candidate</label>
                            <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value.toUpperCase()})} placeholder="SURNAME FIRST NAME" className="w-full px-4 py-3 bg-white border-2 border-slate-400 focus:border-slate-800 outline-none transition-all uppercase font-bold text-slate-900" />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-black tracking-widest text-slate-800 mb-2 uppercase">2. Programme / Level</label>
                            <div className="relative">
                                <select 
                                    required 
                                    value={formData.level} 
                                    onChange={(e) => handleLevelChange(e.target.value)} 
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-400 focus:border-slate-800 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-900"
                                >
                                    <option value="">-- SELECT PROGRAMME --</option>
                                    {STREAMS.map(stream => <option key={stream.id} value={stream.id}>{stream.name}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-800">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section B: Subject Selection (WASSCE Style) */}
                {currentStream && (
                    <div className="border-2 border-slate-800 p-0 bg-white overflow-hidden animate-fade-in shadow-sm">
                        <div className="bg-slate-800 text-white p-3 border-b-2 border-slate-800">
                            <h3 className="text-lg font-black uppercase tracking-widest">Section B: Academic Subjects Registry</h3>
                            <p className="text-xs font-medium opacity-80 mt-1">Please tick [✓] the subjects you intend to register for. Core subjects are mandatory.</p>
                        </div>
                        
                        <div className="p-0">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b-2 border-slate-400">
                                        <th className="px-4 py-3 text-xs font-black text-slate-800 uppercase tracking-widest border-r border-slate-300 w-16 text-center">Tick</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-800 uppercase tracking-widest border-r border-slate-300">Subject Name</th>
                                        <th className="px-4 py-3 text-xs font-black text-slate-800 uppercase tracking-widest">Status / Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStream.subjects.map((subject) => {
                                        const isCore = subject.includes('(Core)');
                                        const isSelected = selectedSubjects.includes(subject);
                                        return (
                                            <tr 
                                                key={subject} 
                                                onClick={() => toggleSubject(subject)}
                                                className={`border-b border-slate-200 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                            >
                                                <td className="px-4 py-3 border-r border-slate-300 text-center">
                                                    <div className={`w-6 h-6 border-2 mx-auto flex items-center justify-center flex-shrink-0 ${isCore ? 'border-slate-800 bg-slate-200 cursor-not-allowed' : (isSelected ? 'border-slate-800 bg-slate-800' : 'border-slate-400 bg-white')}`}>
                                                        {isSelected && <Check size={16} className={isCore ? "text-slate-800" : "text-white"} strokeWidth={3} />}
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 border-r border-slate-300 font-bold ${isCore ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {subject.replace(' (Core)', '')}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold text-slate-600">
                                                    {isCore ? 'MANDATORY' : `OPTIONAL (SLL ${currentStream.pricePerSubject})`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-100 p-5 flex items-center justify-between border-t-2 border-slate-800">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Tuition Assessment</p>
                                <p className="text-sm font-bold text-slate-800">Subjects Selected: {selectedSubjects.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 inline-block">SLL {totalFees.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section C: Parent/Guardian Info */}
                <div className="border-2 border-slate-800 p-6 bg-slate-50/50 mt-8">
                    <h3 className="absolute -mt-10 bg-white px-2 text-lg font-black uppercase tracking-widest text-slate-800">Section C: Guarantor Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black tracking-widest text-slate-800 mb-2 uppercase">1. Full Name of Sponsor/Parent</label>
                            <input type="text" required value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value.toUpperCase()})} placeholder="SURNAME FIRST NAME" className="w-full px-4 py-3 bg-white border-2 border-slate-400 focus:border-slate-800 outline-none transition-all font-bold uppercase text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-black tracking-widest text-slate-800 mb-2 uppercase">2. Active Telephone / WhatsApp</label>
                            <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="+232 XX XXXXXX" className="w-full px-4 py-3 bg-white border-2 border-slate-400 focus:border-slate-800 outline-none transition-all font-bold text-slate-900 uppercase" />
                        </div>
                    </div>
                </div>
                
                {/* Official Declaration */}
                <div className="mt-8 border-t-2 border-dashed border-slate-300 pt-6">
                    <p className="text-xs text-justify text-slate-600 font-medium mb-6 leading-relaxed">
                        DECLARATION: I hereby declare that the information provided on this form is complete and accurate to the best of my knowledge. I understand that any false declaration may result in the cancellation of this admission. I agree to abide by the rules and regulations governing Direct Access Syndicate.
                    </p>
                    <div className="grid grid-cols-2 gap-8 text-center italic mt-12">
                        <div>
                            <div className="w-48 mx-auto border-b border-slate-400 mb-2 h-8"></div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Signature of Candidate</p>
                        </div>
                        <div>
                            <div className="w-48 mx-auto border-b border-slate-400 mb-2 h-8"></div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Signature of Parent/Sponsor</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-none font-black tracking-widest uppercase hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 border-2 border-slate-900 border-b-4 focus:translate-y-1 focus:border-b-2">
                        {loading ? 'Processing Document...' : <><Send size={20} /> Submit Official Registration</>}
                    </button>
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-xs font-black tracking-widest uppercase text-slate-500 hover:text-slate-800 transition-colors underline decoration-2 underline-offset-4">Return to Main Portal</Link>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Apply;
