import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { ASSETS_BASE_URL } from '../config';
import { Users, Edit, Trash2, Search, X, Save, UserPlus } from 'lucide-react';

const AdminParents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingParent, setEditingParent] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchParents = async () => {
        try {
            const { data } = await api.get('/parents/all');
            setParents(data);
        } catch (err) {
            console.error('Failed to fetch parents', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this parent? This action cannot be undone.')) return;
        try {
            await api.delete(`/parents/${id}`);
            fetchParents();
        } catch (err) {
            alert('Failed to delete parent');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await Promise.all([
                api.put(`/parents/${editingParent.id}`, editingParent),
                api.put(`/learning/students/${editingParent.student_id}/qualify`, { is_qualified: editingParent.is_qualified })
            ]);
            setEditingParent(null);
            fetchParents();
        } catch (err) {
            alert('Failed to update parent');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredParents = parents.filter(p => 
        p.parent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <Layout>
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Parent Management</h1>
                    <p className="text-slate-500 font-medium">View and edit parents registered in the system.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or student..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Parent Details</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Assigned Student</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Qualification</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredParents.map((parent) => (
                                <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                                {parent.profile_img ? (
                                                    <img src={`${ASSETS_BASE_URL}${parent.profile_img}`} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold text-slate-400">{parent.parent_name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-700">{parent.parent_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                                        {parent.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight ${
                                            parent.is_qualified 
                                            ? 'bg-indigo-100 text-indigo-700' 
                                            : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            {parent.is_qualified ? 'Qualified' : 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setEditingParent(parent)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(parent.id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingParent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <form onSubmit={handleUpdate} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">Edit Parent Record</h3>
                            <button type="button" onClick={() => setEditingParent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                    value={editingParent.parent_name}
                                    onChange={(e) => setEditingParent({...editingParent, parent_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                                    value={editingParent.email}
                                    onChange={(e) => setEditingParent({...editingParent, email: e.target.value})}
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <div>
                                    <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">Qualify for Learning Path</p>
                                    <p className="text-xs text-indigo-600 font-medium whitespace-normal pr-4">Unlocks exclusive materials, practicals, and answers for this student.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingParent({...editingParent, is_qualified: !editingParent.is_qualified})}
                                    className={`w-14 h-8 rounded-full transition-all relative ${editingParent.is_qualified ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${editingParent.is_qualified ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                            {/* Note: In a real app we'd fetch students for a dropdown here */}
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setEditingParent(null)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black hover:bg-slate-100 transition-all active:scale-95"
                            >
                                CANCEL
                            </button>
                            <button 
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-500/20 disabled:opacity-50"
                            >
                                {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </Layout>
    );
};

export default AdminParents;
