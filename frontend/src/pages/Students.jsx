import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Users, UserPlus, Trash2 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
     student_name: '', level: '', parent_name: '', contact: ''
  });

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
      if(!window.confirm('Are you sure you want to delete this student?')) return;
      try {
          await api.delete(`/students/${id}`);
          setStudents(students.filter(s => s.id !== id));
      } catch (err) {
          console.error(err);
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/students', formData);
          setIsModalOpen(false);
          setFormData({ student_name: '', level: '', parent_name: '', contact: ''});
          fetchStudents();
      } catch (err) {
          console.error('Error adding student', err);
          alert('Error adding student');
      }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Student Records</h1>
          <p className="text-slate-500">Manage all enrolled students in the system.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-green-500/20 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Parent/Guardian</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                                {student.student_name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800">{student.student_name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm">{student.level}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{student.parent_name}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{student.contact}</td>
                    <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                ))}
                {!loading && students.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500"><Users size={48} className="mx-auto text-slate-300 mb-4" />No students found. Add one to get started.</td></tr>
                )}
                {loading && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading records...</td></tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in-up">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Register New Student</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Student Full Name</label>
                          <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Class Level</label>
                          <select required value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                              <option value="">Select Level</option>
                              <option value="Nursery">Nursery</option>
                              <option value="Primary">Primary</option>
                              <option value="JSS">JSS</option>
                              <option value="SSS Arts">SSS Arts</option>
                              <option value="SSS Science">SSS Science</option>
                              <option value="SSS Commercial">SSS Commercial</option>
                              <option value="IGCSE">IGCSE</option>
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Parent/Guardian Name</label>
                          <input type="text" required value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Contact Number</label>
                          <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="flex gap-3 justify-end mt-8">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                          <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors">Save Student</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </Layout>
  );
};

export default Students;
