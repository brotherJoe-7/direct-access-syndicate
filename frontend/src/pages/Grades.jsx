import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { GraduationCap, Search, Plus, Trash2, Award, ClipboardList } from 'lucide-react';

const Grades = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [grades, setGrades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        subject: '', score: '', term: 'First Term', remark: ''
    });
    const [aiLoading, setAiLoading] = useState(false);

    const terms = ['First Term', 'Second Term', 'Third Term', 'Annual Exam'];

    useEffect(() => {
        const fetchStudents = async () => {
            const { data } = await api.get('/students');
            setStudents(data);
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            fetchGrades();
        }
    }, [selectedStudent]);

    const handleAiSuggest = async () => {
        if (!formData.subject || formData.score === '') {
            alert('Please enter a subject and score first');
            return;
        }
        setAiLoading(true);
        try {
            const { data } = await api.post('/ai/academic-assistant', {
                type: 'grade_remark',
                studentName: selectedStudent?.student_name || 'the student',
                subject: formData.subject,
                score: formData.score
            });
            setFormData({ ...formData, remark: data.text });
        } catch (err) {
            console.error('AI Suggest Error:', err);
            alert('AI Assistant is busy, please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/grades/${selectedStudent.id}`);
            setGrades(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/grades', { ...formData, student_id: selectedStudent.id });
            setIsModalOpen(false);
            setFormData({ subject: '', score: '', term: 'First Term', remark: '' });
            fetchGrades();
        } catch (err) {
            alert('Error saving grade');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this grade?')) return;
        try {
            await api.delete(`/grades/${id}`);
            fetchGrades();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredStudents = students.filter(s => 
        s.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Student List Sidebar */}
                <div className="w-full lg:w-80 space-y-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ClipboardList size={20} className="text-green-600" /> Students
                        </h2>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search student..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {filteredStudents.map(student => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                        selectedStudent?.id === student.id 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                        selectedStudent?.id === student.id ? 'bg-green-500' : 'bg-slate-200'
                                    }`}>
                                        {student.student_name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold truncate">{student.student_name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grades Detail Section */}
                <div className="flex-1">
                    {selectedStudent ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">{selectedStudent.student_name}</h1>
                                    <p className="text-slate-500 font-medium">{selectedStudent.level} • Grading History</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    <Plus size={20} /> Publish Grade
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loading ? (
                                    <div className="col-span-full py-20 flex justify-center"><div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div></div>
                                ) : grades.length === 0 ? (
                                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                        <Award size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-500 font-medium">No grades published for this student yet.</p>
                                    </div>
                                ) : (
                                    grades.map(grade => (
                                        <div key={grade.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative group">
                                            <button 
                                                onClick={() => handleDelete(grade.id)}
                                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
                                                    grade.score >= 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                    <span className="text-lg">{grade.score}%</span>
                                                    <span className="text-[10px] uppercase tracking-tighter opacity-70">{grade.grade}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{grade.term}</p>
                                                    <h3 className="text-xl font-bold text-slate-800">{grade.subject}</h3>
                                                    <p className="text-sm text-slate-500 mt-1 italic">"{grade.remarks}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-center p-8">
                            <GraduationCap size={64} className="text-slate-200 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800">Select a Student</h2>
                            <p className="text-slate-500 max-w-sm mt-2">Click on a student from the sidebar to view and manage their academic performance records.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-800">Publish Performance</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <Plus size={24} className="rotate-45 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Academic Term</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold text-slate-700"
                                        value={formData.term}
                                        onChange={(e) => setFormData({...formData, term: e.target.value})}
                                    >
                                        {terms.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                                    <input 
                                        type="text" required placeholder="e.g. Mathematics"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Score (0-100)</label>
                                <input 
                                    type="number" min="0" max="100" required placeholder="85"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold"
                                    value={formData.score}
                                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Remarks</label>
                                    <button 
                                        type="button"
                                        onClick={handleAiSuggest}
                                        disabled={aiLoading}
                                        className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 flex items-center gap-1"
                                    >
                                        {aiLoading ? 'Thinking...' : '✨ AI Suggest'}
                                    </button>
                                </div>
                                <textarea 
                                    rows="3" placeholder="Excellent performance this term..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 font-bold resize-none font-sans"
                                    value={formData.remark}
                                    onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black hover:bg-slate-100">CANCEL</button>
                            <button type="submit" className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 shadow-lg shadow-green-500/20">PUBLISH</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Grades;
