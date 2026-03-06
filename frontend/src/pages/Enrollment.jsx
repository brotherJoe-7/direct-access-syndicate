import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Enrollment = () => {
  const [formData, setFormData] = useState({
     student_name: '', level: '', contact: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          await api.post('/students/enroll', formData);
          alert('Student enrolled successfully!');
          navigate('/parent');
      } catch (err) {
          console.error('Error enrolling student', err);
          alert('Error enrolling student. Please try again.');
      } finally {
          setLoading(false);
      }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Enroll New Student</h1>
        <p className="text-slate-500">Register your child's details into the school system.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex items-center gap-2 mb-6">
                <UserPlus className="text-green-500" size={24} />
                <h2 className="text-xl font-bold text-slate-800">Student Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Student Full Name</label>
                    <input type="text" required value={formData.student_name} onChange={(e) => setFormData({...formData, student_name: e.target.value})} placeholder="e.g. John Smith" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Class Level</label>
                    <select required value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                        <option value="">-- Select Level --</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Primary">Primary</option>
                        <option value="JSS">JSS</option>
                        <option value="SSS Arts">SSS Arts</option>
                        <option value="SSS Science">SSS Science</option>
                        <option value="SSS Commercial">SSS Commercial</option>
                        <option value="IGCSE">IGCSE</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Emergency Contact Number</label>
                    <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="+232 00 000000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                
                <hr className="border-slate-100 my-6" />

                <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-70">
                        {loading ? 'Enrolling...' : <><Save size={20} /> Complete Enrollment</>}
                    </button>
                </div>
            </form>
      </div>
    </Layout>
  );
};

export default Enrollment;
