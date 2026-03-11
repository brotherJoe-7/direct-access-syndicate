import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Banknote, PlusCircle } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
     category: '', description: '', amount: '', paid_to: ''
  });

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses');
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await api.post('/expenses', formData);
          setFormData({ category: '', description: '', amount: '', paid_to: '' });
          fetchExpenses();
      } catch (err) {
          console.error('Error recording expense', err);
          alert('Error recording expense');
      }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Expenses Management</h1>
        <p className="text-slate-500">Record and track school expenditures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="text-green-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Add New Expense</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <input type="text" placeholder="e.g. Utility, Stationaries" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Amount (SLL)</label>
                    <input type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Paid To</label>
                    <input type="text" required value={formData.paid_to} onChange={(e) => setFormData({...formData, paid_to: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-green-600 text-white rounded-xl font-medium shadow-md shadow-green-500/20 hover:bg-green-700 transition-colors">
                    Save Expense
                </button>
            </form>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Banknote className="text-emerald-500" size={20} />
                <h2 className="text-lg font-bold text-slate-800">Recent Expenses</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-4 py-3 text-sm font-semibold text-slate-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-500 uppercase">Category</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-500 uppercase text-right">Amount (SLL)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-500 text-sm whitespace-nowrap">{new Date(expense.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">{expense.category}</td>
                            <td className="px-4 py-3 text-slate-600">{expense.description} <br/><span className="text-xs text-slate-400">Paid To: {expense.paid_to}</span></td>
                            <td className="px-4 py-3 font-bold text-slate-800 text-right">{Number(expense.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                        ))}
                        {!loading && expenses.length === 0 && (
                        <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No expenses recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </Layout>
  );
};

export default Expenses;
