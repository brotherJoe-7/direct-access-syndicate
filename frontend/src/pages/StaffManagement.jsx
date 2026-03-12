import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { UserPlus, Shield, Trash2, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'teacher' });
    const [message, setMessage] = useState(null);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/staff');
            setStaff(data);
        } catch (err) {
            console.error('Failed to fetch staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/staff', formData);
            setMessage({ type: 'success', text: `Successfully created ${formData.role}: ${formData.username}` });
            setShowModal(false);
            setFormData({ username: '', password: '', role: 'teacher' });
            fetchStaff();
        } catch (err) {
            console.error('Create staff error:', err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create staff member' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this staff member? This will immediately revoke their access.')) return;
        try {
            await api.delete(`/staff/${id}`);
            setMessage({ type: 'success', text: 'Staff member removed successfully.' });
            fetchStaff();
        } catch (err) {
            console.error('Delete error:', err);
            setMessage({ type: 'error', text: 'Failed to delete staff member.' });
        }
    };

    return (
        <Layout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Staff & Access Control</h1>
                    <p className="text-slate-500 mt-1">Manage logins and permissions for teachers and administrators.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all active:scale-95 whitespace-nowrap"
                >
                    <UserPlus size={20} /> Add New Staff
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    <p className="font-semibold text-sm">{message.text}</p>
                    <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100"><XCircle size={16}/></button>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 uppercase">
                                                    {member.username.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800">{member.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {member.role === 'admin' ? (
                                                     <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-red-100">
                                                         <Shield size={12} /> Administrator
                                                     </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 border border-blue-100">
                                                        <ShieldAlert size={12} /> Teacher
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">
                                            {formatDate(member.created_at)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {staff.length === 0 && (
                            <div className="p-16 text-center">
                                <Shield size={48} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">No staff accounts found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">New Staff Account</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Username</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    placeholder="e.g. teacher_mike"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().trim()})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Initial Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">System Role</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="teacher">Teacher (Operational Access Only)</option>
                                    <option value="admin">Administrator (Full Access including Finances)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default StaffManagement;
