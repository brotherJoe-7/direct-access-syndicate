import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Receipt, Save } from 'lucide-react';

const NewReceipt = () => {
  const [formData, setFormData] = useState({
    issue_date: new Date().toISOString().split('T')[0],
    parent_name: '',
    student_name: '',
    level: '',
    method: 'Cash',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/receipts', formData);
      alert(`Receipt Created Successfully! Number: ${data.receipt_no}`);
      navigate('/admin/receipts');
    } catch (err) {
      alert('Failed to create receipt');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Create New Receipt</h1>
        <p className="text-slate-500">Generate a new transaction receipt for a parent.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Issue Date</label>
                    <input type="date" name="issue_date" required value={formData.issue_date} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Amount Paid (SLL)</label>
                    <input type="number" step="0.01" name="amount" required placeholder="Ex: 500000" value={formData.amount} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-slate-800" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Parent/Guardian Name</label>
                    <input type="text" name="parent_name" required placeholder="Full Name" value={formData.parent_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Student Name</label>
                    <input type="text" name="student_name" required placeholder="Full Name" value={formData.student_name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Class Level</label>
                    <select name="level" required value={formData.level} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
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
                    <label className="text-sm font-semibold text-slate-700">Payment Method</label>
                    <select name="method" required value={formData.method} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                        <option value="Cash">Cash</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Bank">Bank</option>
                    </select>
                </div>
            </div>

            <hr className="border-slate-100 my-6" />

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="px-8 py-3 flex items-center gap-2 font-bold bg-green-600 text-white rounded-xl shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors disabled:opacity-70">
                    {loading ? 'Processing...' : <><Save size={20} /> Generate & Save</>}
                </button>
            </div>
         </form>
      </div>
    </Layout>
  );
};

export default NewReceipt;
