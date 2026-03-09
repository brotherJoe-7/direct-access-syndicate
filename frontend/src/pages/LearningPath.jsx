import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { BookOpen, FileText, Play, CheckCircle, Download, ExternalLink, Headphones, MessageSquare } from 'lucide-react';

const LearningPath = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data } = await api.get('/learning/materials');
                setMaterials(data);
            } catch (err) {
                console.error('Failed to fetch materials', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const filteredMaterials = filter === 'All' 
        ? materials 
        : materials.filter(m => m.type === filter);

    const types = ['All', 'Material', 'Exercise', 'Practical', 'Answer'];

    if (loading) return (
        <Layout>
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Learning Path</h1>
                <p className="text-slate-500 font-medium">Exclusive resources, exercises, and practicals for qualified students.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {types.map(t => (
                    <button 
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-6 py-2.5 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                            filter === t 
                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                            : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                        }`}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>

            {filteredMaterials.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No materials found</h3>
                    <p className="text-slate-400">Check back later for new exercises and lessons.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 group">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${
                                    item.type === 'Exercise' ? 'bg-orange-50 text-orange-600' :
                                    item.type === 'Practical' ? 'bg-blue-50 text-blue-600' :
                                    item.type === 'Answer' ? 'bg-green-50 text-green-600' :
                                    'bg-indigo-50 text-indigo-600'
                                }`}>
                                    {item.type === 'Material' && <BookOpen size={24} />}
                                    {item.type === 'Exercise' && <FileText size={24} />}
                                    {item.type === 'Practical' && <Play size={24} />}
                                    {item.type === 'Answer' && <CheckCircle size={24} />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-3 py-1 rounded-full">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-green-600 transition-colors">{item.title}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                                {item.description}
                            </p>

                            <div className="flex gap-3">
                                <a 
                                    href={item.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                                >
                                    <Download size={14} /> DOWNLOAD
                                </a>
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <Info size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Accessibility / Help Section */}
            <div className="mt-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-green-600/20">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0">
                        <Headphones size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-black mb-2">Need Help with your Materials?</h2>
                        <p className="text-white/80 font-medium">Click the audio button on any lesson to hear it read aloud, or chat with your teacher directly.</p>
                    </div>
                    <button className="md:ml-auto px-10 py-5 bg-white text-green-700 rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-tight">
                        Contact Support
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
            </div>
        </Layout>
    );
};

export default LearningPath;
